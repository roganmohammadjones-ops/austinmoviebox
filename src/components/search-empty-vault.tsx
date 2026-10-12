import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

const CURATED_SHELVES = [
  { label: 'Cyberpunk', icon: 'hardware-chip-outline', query: 'Cyberpunk' },
  { label: 'French New Wave', icon: 'book-outline', query: 'New Wave' },
  { label: 'Criterion Gems', icon: 'ribbon-outline', query: 'Criterion' },
  { label: '70s Sci-Fi', icon: 'planet-outline', query: 'Sci-Fi 1970' },
  { label: 'Neo-Noir', icon: 'contrast-outline', query: 'Noir' },
  { label: 'Psychological', icon: 'eye-outline', query: 'Psychological' },
];

interface SearchEmptyVaultProps {
  query?: string;
  onClearFilters: () => void;
  onSelectShelf: (shelfQuery: string) => void;
}

export function SearchEmptyVault({
  query,
  onClearFilters,
  onSelectShelf,
}: SearchEmptyVaultProps) {
  return (
    <View style={styles.container}>
      {/* Primary Card */}
      <View style={styles.card}>
        {/* Loupe & 35mm Film Graphic */}
        <View style={styles.graphicContainer}>
          <View style={styles.filmStrip}>
            {/* Sprocket holes left */}
            <View style={styles.sprocketColumn}>
              {[1, 2, 3, 4].map((i) => (
                <View key={`l-${i}`} style={styles.sprocketHole} />
              ))}
            </View>

            {/* Aperture Frame */}
            <View style={styles.apertureFrame}>
              <Ionicons name="search" size={32} color={colors.cinemaAmber} />
            </View>

            {/* Sprocket holes right */}
            <View style={styles.sprocketColumn}>
              {[1, 2, 3, 4].map((i) => (
                <View key={`r-${i}`} style={styles.sprocketHole} />
              ))}
            </View>
          </View>
        </View>

        {/* Editorial Headline & Copy */}
        <Text style={styles.headline}>No titles found in the vault</Text>
        <Text style={styles.description}>
          {query ? (
            <>
              We couldn&apos;t match any archives with{' '}
              <Text style={styles.queryHighlight}>&ldquo;{query}&rdquo;</Text>. Try rephrasing or
              explore our curated master shelves below.
            </>
          ) : (
            'No matching titles found for the selected genre filter. Try exploring our curated master shelves below.'
          )}
        </Text>

        {/* Clear Action Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search & filters"
          onPress={onClearFilters}
          style={({ pressed }) => [
            styles.clearButton,
            { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.cinemaAmber} />
          <Text style={styles.clearButtonText}>Clear search & filters</Text>
        </Pressable>
      </View>

      {/* Curated Shelves / Quick Dive Section */}
      <View style={styles.shelvesSection}>
        <View style={styles.shelvesHeader}>
          <Text style={styles.shelvesTitle}>Curated Shelves</Text>
          <Text style={styles.shelvesBadge}>QUICK DIVE</Text>
        </View>

        <View style={styles.shelvesGrid}>
          {CURATED_SHELVES.map((shelf) => (
            <Pressable
              key={shelf.label}
              accessibilityRole="button"
              accessibilityLabel={`Explore ${shelf.label}`}
              onPress={() => onSelectShelf(shelf.query)}
              style={({ pressed }) => [
                styles.shelfChip,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Ionicons
                name={shelf.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={colors.cinemaAmber}
              />
              <Text style={styles.shelfChipText}>{shelf.label}</Text>
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
    paddingVertical: 24,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    paddingVertical: 28,
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
  filmStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quietStage,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  sprocketColumn: {
    gap: 6,
    paddingHorizontal: 4,
  },
  sprocketHole: {
    width: 6,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.cinemaCanvas,
  },
  apertureFrame: {
    width: 64,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.cinemaCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(215, 163, 91, 0.3)',
  },
  headline: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 18,
  },
  queryHighlight: {
    color: colors.primaryInk,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  clearButtonText: {
    color: colors.cinemaAmber,
    fontSize: 13,
    fontWeight: '600',
  },
  shelvesSection: {
    width: '100%',
  },
  shelvesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shelvesTitle: {
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  shelvesBadge: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
    letterSpacing: 0.6,
  },
  shelvesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shelfChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  shelfChipText: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '500',
  },
});
