import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

const QUICK_JUMP_TAGS = [
  { label: 'Award Winners', icon: 'trophy-outline', query: 'Award' },
  { label: 'Sci-Fi Icons', icon: 'planet-outline', query: 'Sci-Fi' },
  { label: 'Film Noir', icon: 'contrast-outline', query: 'Noir' },
  { label: 'Trending', icon: 'flame-outline', query: 'Trending' },
];

interface FavoritesEmptyVaultProps {
  onDiscoverPress: () => void;
  onQuickJumpPress: (query: string) => void;
}

export function FavoritesEmptyVault({
  onDiscoverPress,
  onQuickJumpPress,
}: FavoritesEmptyVaultProps) {
  return (
    <View style={styles.container}>
      {/* Primary Empty State Card */}
      <View style={styles.card}>
        {/* Celluloid Heart Film Graphic */}
        <View style={styles.graphicContainer}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart-outline" size={42} color={colors.cinemaAmber} />
            <View style={styles.starBadge}>
              <Ionicons name="sparkles" size={12} color={colors.cinemaAmber} />
            </View>
          </View>
        </View>

        {/* Title & Copy */}
        <Text style={styles.headline}>No favorites yet</Text>
        <Text style={styles.description}>
          Tap the heart icon on any film to preserve it in your personal vault. All entries
          remain saved locally on this device.
        </Text>

        {/* Primary CTA */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Discover movies"
          onPress={onDiscoverPress}
          style={({ pressed }) => [
            styles.primaryButton,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Text style={styles.primaryButtonText}>Discover movies</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.cinemaCanvas} />
        </Pressable>
      </View>

      {/* Quick Jump Curated Shelves */}
      <View style={styles.quickJumpSection}>
        <View style={styles.quickJumpHeader}>
          <Text style={styles.quickJumpTitle}>Quick Jump</Text>
          <Text style={styles.quickJumpBadge}>CURATED SHELVES</Text>
        </View>

        <View style={styles.tagsRow}>
          {QUICK_JUMP_TAGS.map((tag) => (
            <Pressable
              key={tag.label}
              accessibilityRole="button"
              accessibilityLabel={`Explore ${tag.label}`}
              onPress={() => onQuickJumpPress(tag.query)}
              style={({ pressed }) => [
                styles.tagChip,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Ionicons
                name={tag.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={colors.cinemaAmber}
              />
              <Text style={styles.tagChipText}>{tag.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
    marginBottom: 24,
  },
  graphicContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(215, 163, 91, 0.3)',
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  headline: {
    color: colors.primaryInk,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 20,
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
  quickJumpSection: {
    width: '100%',
  },
  quickJumpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickJumpTitle: {
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  quickJumpBadge: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
    letterSpacing: 0.6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  tagChipText: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '500',
  },
});
