import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '../stores/auth-store';
import { useFavoritesStore } from '../stores/favorites-store';
import { useOnboardingStore } from '../stores/onboarding-store';
import { usePreferencesStore } from '../stores/preferences-store';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  useEffect(() => {
    async function bootstrap() {
      try {
        await Promise.all([
          useOnboardingStore.getState().loadOnboarding(),
          useFavoritesStore.getState().hydrateFavorites(),
          useAuthStore.getState().initializeAuth(),
          usePreferencesStore.getState().loadPreferences(),
        ]);
      } catch (e) {
        console.warn('Bootstrap failed:', e);
      }
    }
    bootstrap();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cinemaCanvas },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
  },
});
