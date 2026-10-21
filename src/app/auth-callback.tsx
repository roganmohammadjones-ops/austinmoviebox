import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { useAuthStore } from '../stores/auth-store';
import { colors } from '../theme/tokens';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const incomingUrl = Linking.useLinkingURL();
  const query = new URLSearchParams();
  for (const key of ['code', 'access_token', 'refresh_token', 'error', 'error_description']) {
    const value = params[key];
    if (typeof value === 'string') query.set(key, value);
  }
  const queryString = query.toString();
  const callbackUrl = Platform.OS === 'web' && typeof window !== 'undefined'
    ? window.location.href
    : queryString
      ? `austinmoviebox://auth-callback?${queryString}`
      : incomingUrl?.includes('auth-callback') ? incomingUrl : null;

  useEffect(() => {
    let active = true;
    // Native launch URLs may arrive after the route mounts.
    if (!callbackUrl) return;
    void useAuthStore.getState().completeOAuthSignIn(callbackUrl).then((result) => {
      if (!active) return;
      if (Platform.OS === 'web') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      router.replace(result.success ? '/(tabs)' : '/auth');
    });
    return () => { active = false; };
  }, [callbackUrl, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.cinemaAmber} />
      <Text style={styles.text}>Completing Google sign-in…</Text>
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
