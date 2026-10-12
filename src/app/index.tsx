import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useOnboardingStore } from '../stores/onboarding-store';
import { colors } from '../theme/tokens';

export default function IndexScreen() {
  const { hasCompletedOnboarding, isLoaded, loadOnboarding } = useOnboardingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadOnboarding().then(() => setMounted(true));
  }, [loadOnboarding]);

  if (!isLoaded || !mounted) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="film" size={32} color={colors.cinemaAmber} />
        </View>
        <Text style={styles.logoTitle}>AUSTIN MOVIEBOX</Text>
        <Text style={styles.logoSubtitle}>CURATED THEATRICAL ARCHIVE</Text>
        <ActivityIndicator color={colors.cinemaAmber} style={styles.spinner} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href={'/onboarding' as any} />;
  }

  return <Redirect href={'/(tabs)' as any} />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  logoTitle: {
    color: colors.primaryInk,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  logoSubtitle: {
    color: colors.mutedInk,
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: 'Courier',
  },
  spinner: {
    marginTop: 24,
  },
});
