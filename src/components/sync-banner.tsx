import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../stores/auth-store';
import { colors } from '../theme/tokens';

export function SyncBanner() {
  const router = useRouter();
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);

  const handleSignIn = () => {
    router.push('/auth' as any);
  };

  if (!isGuest && user) {
    return (
      <View style={[styles.container, styles.syncedContainer]}>
        <View style={styles.iconBox}>
          <Ionicons name="cloud-done" size={20} color={colors.cinemaAmber} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Cloud Synced Vault</Text>
          <Text style={styles.descText}>
            Synchronized with <Text style={styles.emailHighlight}>{user.email}</Text>. Your library
            is backed up.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="cloud-offline" size={20} color={colors.cinemaAmber} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Local Guest Storage</Text>
          <Text style={styles.descText}>
            Your collection is stored locally on this phone. Sign in to sync your favorites across
            all devices.
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign in to sync favorites"
          onPress={handleSignIn}
          style={({ pressed }) => [
            styles.signInButton,
            { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
        >
          <Ionicons name="log-in-outline" size={18} color={colors.cinemaAmber} />
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  syncedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: colors.primaryInk,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  descText: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 18,
  },
  emailHighlight: {
    color: colors.cinemaAmber,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  signInButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.quietStage,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  signInButtonText: {
    color: colors.cinemaAmber,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
