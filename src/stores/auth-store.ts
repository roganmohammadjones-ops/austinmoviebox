import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const GUEST_STORAGE_KEY = '@moviebox_is_guest';

interface AuthState {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isGuest: true,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Run fully in guest mode
        const storedGuest = await AsyncStorage.getItem(GUEST_STORAGE_KEY);
        set({
          user: null,
          session: null,
          isGuest: storedGuest !== 'false',
          isLoading: false,
        });
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase getSession warning:', error.message);
      }

      if (data?.session) {
        set({
          session: data.session,
          user: data.session.user,
          isGuest: false,
          isLoading: false,
        });
      } else {
        set({
          session: null,
          user: null,
          isGuest: true,
          isLoading: false,
        });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          set({
            session,
            user: session.user,
            isGuest: false,
          });
        } else {
          set({
            session: null,
            user: null,
            isGuest: true,
          });
        }
      });
    } catch (err) {
      console.warn('Auth initialization error:', err);
      set({ isLoading: false, isGuest: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured) {
      // Offline / Local mock sign in for testing
      const mockUser = {
        id: 'usr_' + Date.now(),
        email,
        app_metadata: {},
        user_metadata: { name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock_token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh',
        user: mockUser,
      } as Session;

      await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'false');
      set({
        user: mockUser,
        session: mockSession,
        isGuest: false,
        isLoading: false,
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'false');
      set({
        user: data.user,
        session: data.session,
        isGuest: false,
        isLoading: false,
      });
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Failed to sign in';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured) {
      // Offline / Local mock sign up for testing
      const mockUser = {
        id: 'usr_' + Date.now(),
        email,
        app_metadata: {},
        user_metadata: { name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock_token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh',
        user: mockUser,
      } as Session;

      await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'false');
      set({
        user: mockUser,
        session: mockSession,
        isGuest: false,
        isLoading: false,
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }

      await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'false');
      set({
        user: data.user,
        session: data.session,
        isGuest: false,
        isLoading: false,
      });
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Failed to sign up';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'true');
    set({
      user: null,
      session: null,
      isGuest: true,
      isLoading: false,
    });
  },

  continueAsGuest: async () => {
    await AsyncStorage.setItem(GUEST_STORAGE_KEY, 'true');
    set({
      user: null,
      session: null,
      isGuest: true,
      isLoading: false,
    });
  },
}));
