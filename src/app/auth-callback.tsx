import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/auth-store';
import { useFavoritesStore } from '../stores/favorites-store';
import { colors } from '../theme/tokens';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState('Completing authorization...');

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        let accessToken = (params.access_token as string) || undefined;
        let refreshToken = (params.refresh_token as string) || undefined;
        let code = (params.code as string) || undefined;
        let errorMsg = (params.error_description as string) || (params.error as string) || undefined;

        // If on web or tokens are in URL hash fragment
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash) {
          const fragment = window.location.hash.substring(1);
          const hashParams = new URLSearchParams(fragment);
          errorMsg = hashParams.get('error_description') || hashParams.get('error') || errorMsg;
          accessToken = hashParams.get('access_token') || accessToken;
          refreshToken = hashParams.get('refresh_token') || refreshToken;
          code = hashParams.get('code') || code;
        }

        if (errorMsg && isMounted) {
          useAuthStore.setState({ error: errorMsg, isLoading: false });
          router.replace('/auth');
          return;
        }

        if (accessToken && refreshToken) {
          setStatus('Securing session...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error && data.session && isMounted) {
            await AsyncStorage.setItem('@moviebox_is_guest', 'false');
            useAuthStore.setState({
              user: data.session.user,
              session: data.session,
              isGuest: false,
              isLoading: false,
            });
            await useFavoritesStore.getState().syncWithCloud(data.session.user.id);
            router.replace('/(tabs)');
            return;
          }
        } else if (code) {
          setStatus('Exchanging authorization code...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (!error && data.session && isMounted) {
            await AsyncStorage.setItem('@moviebox_is_guest', 'false');
            useAuthStore.setState({
              user: data.session.user,
              session: data.session,
              isGuest: false,
              isLoading: false,
            });
            await useFavoritesStore.getState().syncWithCloud(data.session.user.id);
            router.replace('/(tabs)');
            return;
          }
        }

        // Check if session is already recognized by Supabase client
        const { data: existingSession } = await supabase.auth.getSession();
        if (existingSession?.session && isMounted) {
          await AsyncStorage.setItem('@moviebox_is_guest', 'false');
          useAuthStore.setState({
            user: existingSession.session.user,
            session: existingSession.session,
            isGuest: false,
            isLoading: false,
          });
          await useFavoritesStore.getState().syncWithCloud(existingSession.session.user.id);
          router.replace('/(tabs)');
          return;
        }

        // If no credentials found after a brief moment, return home
        setTimeout(() => {
          if (isMounted) {
            router.replace('/(tabs)');
          }
        }, 1200);
      } catch (err) {
        console.warn('[AuthCallback] Failed to complete callback:', err);
        if (isMounted) {
          router.replace('/(tabs)');
        }
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.cinemaAmber} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
