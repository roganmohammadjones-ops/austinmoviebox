import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Session } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { AppState, Platform } from 'react-native';
import { create } from 'zustand';
import { createOAuthCallbackHandler, webAuthRedirectUrl } from '../services/oauth-flow';
import { supabase, isSupabaseConfigured } from '../services/supabase';

WebBrowser.maybeCompleteAuthSession();

const GUEST_STORAGE_KEY = '@moviebox_is_guest';
const oauthCallback = createOAuthCallbackHandler<Session>(supabase.auth);
let initialization: Promise<void> | null = null;
let listening = false;

type AuthResult = { success: boolean; error?: string; needsEmailConfirmation?: boolean };

interface AuthState {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: (email?: string) => Promise<AuthResult>;
  completeOAuthSignIn: (url: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const acceptSession = (session: Session | null) => {
    set({ session, user: session?.user ?? null, isGuest: !session, isLoading: false, error: null });
    void AsyncStorage.setItem(GUEST_STORAGE_KEY, session ? 'false' : 'true').catch(() => {});
  };
  const fail = (error: unknown): AuthResult => {
    const message = error instanceof Error ? error.message : 'Sign-in failed. Please try again.';
    set({ error: message, isLoading: false });
    return { success: false, error: message };
  };
  const requireConfigured = () => {
    if (!isSupabaseConfigured) throw new Error('Sign-in is unavailable. You can continue browsing as a guest.');
  };

  return {
    user: null,
    session: null,
    isGuest: true,
    isLoading: true,
    error: null,
    clearError: () => set({ error: null }),

    initializeAuth: () => {
      if (initialization) return initialization;
      initialization = (async () => {
        if (!isSupabaseConfigured) {
          acceptSession(null);
          return;
        }
        // Install once; auth events must not await another Supabase operation.
        if (!listening) {
          listening = true;
          supabase.auth.onAuthStateChange((_event, session) => acceptSession(session));
          if (Platform.OS !== 'web') {
            const updateRefresh = (state: string) => {
              if (state === 'active') supabase.auth.startAutoRefresh();
              else supabase.auth.stopAutoRefresh();
            };
            AppState.addEventListener('change', updateRefresh);
            updateRefresh(AppState.currentState);
          }
        }
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          acceptSession(data.session);
        } catch {
          acceptSession(null);
        }
      })();
      return initialization;
    },

    signIn: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        requireConfigured();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        acceptSession(data.session);
        return { success: true };
      } catch (error) {
        return fail(error);
      }
    },

    signUp: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        requireConfigured();
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        acceptSession(data.session);
        return { success: true, needsEmailConfirmation: !data.session };
      } catch (error) {
        return fail(error);
      }
    },

    completeOAuthSignIn: async (url) => {
      set({ isLoading: true, error: null });
      try {
        const session = await oauthCallback.complete(url);
        acceptSession(session);
        return { success: true };
      } catch (error) {
        return fail(error);
      }
    },

    signInWithGoogle: async (email) => {
      set({ isLoading: true, error: null });
      oauthCallback.reset();
      try {
        requireConfigured();
        const redirectTo = Platform.OS === 'web'
          ? webAuthRedirectUrl(window.location.origin, Constants.expoConfig?.experiments?.baseUrl)
          : Linking.createURL('auth-callback', { scheme: 'austinmoviebox' });
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'email profile',
            redirectTo,
            skipBrowserRedirect: true,
            queryParams: { prompt: 'select_account', ...(email ? { login_hint: email } : {}) },
          },
        });
        if (error) throw error;
        if (!data.url) throw new Error('Google sign-in is unavailable. Please try again.');

        if (Platform.OS === 'web') {
          window.location.assign(data.url);
          return { success: true };
        }
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (result.type === 'success') return await get().completeOAuthSignIn(result.url);
        // Android may route the callback before dismissing the browser window.
        if (get().session) return { success: true };
        if (result.type === 'cancel' || result.type === 'dismiss') {
          set({ isLoading: false });
          return { success: false };
        }
        throw new Error('Google sign-in did not finish. Please try again.');
      } catch (error) {
        return fail(error);
      }
    },

    signOut: async () => {
      set({ isLoading: true, error: null });
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          fail(error);
          throw error;
        }
      }
      oauthCallback.reset();
      acceptSession(null);
    },

    continueAsGuest: async () => {
      if (get().session) await get().signOut();
      else acceptSession(null);
    },
  };
});
