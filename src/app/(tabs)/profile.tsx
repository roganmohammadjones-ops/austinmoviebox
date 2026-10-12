import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth-store';
import { useFavoritesStore } from '../../stores/favorites-store';
import { colors } from '../../theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, signOut } = useAuthStore();
  const { favorites: rawFavorites, clearFavorites } = useFavoritesStore();
  const favorites = Array.isArray(rawFavorites) ? rawFavorites : [];

  const handleCreateAccount = () => {
    router.push('/auth' as any);
  };

  const handleSignIn = () => {
    router.push('/auth' as any);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from your cloud vault?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleManageCache = () => {
    Alert.alert(
      'Manage Local Storage',
      `You have ${favorites.length} movies stored locally (~${(favorites.length * 0.3).toFixed(1)} MB).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Local Favorites',
          style: 'destructive',
          onPress: async () => {
            await clearFavorites();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headlineText}>Profile</Text>
        <Text style={styles.subheadText}>Manage guest session & local library storage</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status / Session Card */}
        <View style={styles.sessionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgePill}>
              <Ionicons
                name={isGuest ? 'hardware-chip-outline' : 'shield-checkmark-outline'}
                size={16}
                color={colors.cinemaAmber}
              />
              <Text style={styles.badgePillText}>{isGuest ? 'Guest Mode' : 'Member Vault'}</Text>
            </View>

            <View style={styles.liveIndicator}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveIndicatorText}>
                {isGuest ? 'LOCAL CACHE' : 'CLOUD SYNCED'}
              </Text>
            </View>
          </View>

          {isGuest ? (
            <>
              <View style={styles.bodyTexts}>
                <Text style={styles.bodyMainText}>
                  You are browsing anonymously. Your favorites are saved locally on this device{' '}
                  <Text style={styles.amberHighlight}>({favorites.length} titles saved)</Text>.
                </Text>
                <Text style={styles.bodySecondaryText}>
                  Sign in or register to sync your watchlist, unlock custom reviews, and back up
                  your vault across devices.
                </Text>
              </View>

              <View style={styles.buttonsColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create account"
                  onPress={handleCreateAccount}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Ionicons name="person-add-outline" size={18} color={colors.cinemaCanvas} />
                  <Text style={styles.primaryButtonText}>Create account</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sign in to existing account"
                  onPress={handleSignIn}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Ionicons name="log-in-outline" size={18} color={colors.secondaryInk} />
                  <Text style={styles.secondaryButtonText}>Sign in to existing account</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.bodyTexts}>
                <Text style={styles.bodyMainText}>
                  Authenticated as <Text style={styles.amberHighlight}>{user?.email}</Text>
                </Text>
                <Text style={styles.bodySecondaryText}>
                  Your watchlist of {favorites.length} titles is securely backed up and synchronized
                  with Supabase cloud.
                </Text>
              </View>

              <View style={styles.buttonsColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sign out"
                  onPress={handleSignOut}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Ionicons name="log-out-outline" size={18} color={colors.error} />
                  <Text style={[styles.secondaryButtonText, { color: colors.error }]}>Sign out</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Local Stash Preview */}
        {favorites.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Local Stash Preview</Text>
              <Text style={styles.sectionCountBadge}>{favorites.length} ENTRIES</Text>
            </View>

            <View style={styles.stashThumbnailsRow}>
              {favorites.slice(0, 4).map((fav) => (
                <Pressable
                  key={fav.id}
                  accessibilityRole="button"
                  onPress={() => router.push(`/movie/${fav.id}` as any)}
                  style={styles.stashThumbnail}
                >
                  <Image
                    source={{ uri: fav.posterUrl }}
                    style={styles.stashImage}
                    contentFit="cover"
                  />
                  <View style={styles.stashTitleScrim}>
                    <Text numberOfLines={1} style={styles.stashTitleText}>
                      {fav.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Preferences & System Group */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Preferences & System</Text>
          <View style={styles.settingsGroup}>
            {/* Row 1: Stored Local Data */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="server-outline" size={18} color={colors.cinemaAmber} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Stored Local Data</Text>
                  <Text style={styles.settingSubLabel}>
                    {favorites.length} movies · {(favorites.length * 0.3).toFixed(1)} MB
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Manage storage"
                onPress={handleManageCache}
                style={styles.manageButton}
              >
                <Text style={styles.manageButtonText}>Manage</Text>
              </Pressable>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 2: Appearance */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="color-palette-outline" size={18} color={colors.cinemaAmber} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Appearance</Text>
                  <Text style={styles.settingSubLabel}>Dark Cinema (System default)</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.mutedInk} />
            </View>

            <View style={styles.rowDivider} />

            {/* Row 3: About */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBox}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.cinemaAmber} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>About & Film Data</Text>
                  <Text style={styles.settingSubLabel}>Powered by TMDB API</Text>
                </View>
              </View>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v2.4</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ephemeral Sandbox Storage Footnote */}
        <View style={styles.footnoteContainer}>
          <View style={styles.footnoteHeader}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.mutedInk} />
            <Text style={styles.footnoteHeaderText}>EPHEMERAL SANDBOX STORAGE</Text>
          </View>
          <Text style={styles.footnoteDescText}>
            Cache will persist until app storage is purged or overwritten by account sync.
          </Text>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
  },
  innerWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 768,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.3)',
  },
  headlineText: {
    color: colors.primaryInk,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subheadText: {
    color: colors.secondaryInk,
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sessionCard: {
    backgroundColor: colors.raisedStage,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  badgePillText: {
    color: colors.primaryInk,
    fontSize: 12,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  liveIndicatorText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'Courier',
  },
  bodyTexts: {
    gap: 6,
    marginBottom: 18,
  },
  bodyMainText: {
    color: colors.primaryInk,
    fontSize: 14,
    lineHeight: 20,
  },
  amberHighlight: {
    color: colors.cinemaAmber,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  bodySecondaryText: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 18,
  },
  buttonsColumn: {
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: colors.cinemaCanvas,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.quietStage,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  secondaryButtonText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.primaryInk,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionCountBadge: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  stashThumbnailsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stashThumbnail: {
    flex: 1,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.quietStage,
    position: 'relative',
  },
  stashImage: {
    width: '100%',
    height: '100%',
  },
  stashTitleScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    backgroundColor: 'rgba(17, 18, 20, 0.85)',
  },
  stashTitleText: {
    color: colors.primaryInk,
    fontSize: 9,
    fontWeight: '600',
  },
  settingsGroup: {
    backgroundColor: colors.quietStage,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.raisedStage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '600',
  },
  settingSubLabel: {
    color: colors.secondaryInk,
    fontSize: 12,
    marginTop: 2,
  },
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.raisedStage,
  },
  manageButtonText: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(53, 56, 60, 0.3)',
    marginLeft: 60,
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.raisedStage,
  },
  versionText: {
    color: colors.mutedInk,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  footnoteContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footnoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footnoteHeaderText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  footnoteDescText: {
    color: colors.mutedInk,
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 16,
  },
});
