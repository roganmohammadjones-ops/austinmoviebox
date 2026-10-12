import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/empty-state';
import { MovieCard } from '../../components/movie-card';
import { SyncBanner } from '../../components/sync-banner';
import { useFavoritesStore } from '../../stores/favorites-store';
import { colors } from '../../theme/tokens';
import { Movie } from '../../types';

type FilterType = 'recent' | 'rated' | 'runtime';

const EMPTY_FAVORITES: Movie[] = [];

export default function FavoritesScreen() {
  const router = useRouter();
  const rawFavorites = useFavoritesStore((state) => state.favorites);
  const favorites = Array.isArray(rawFavorites) ? rawFavorites : EMPTY_FAVORITES;
  const [filter, setFilter] = useState<FilterType>('recent');

  const sortedFavorites = useMemo(() => {
    const list = [...favorites];
    if (filter === 'rated') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (filter === 'runtime') {
      return list.sort((a, b) => (b.durationMinutes || 0) - (a.durationMinutes || 0));
    }
    return list; // recent
  }, [favorites, filter]);

  const handleBrowseCatalog = () => {
    router.push('/(tabs)' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Header Block */}
      <View style={styles.headerBlock}>
        <View style={styles.titleSection}>
          <Text style={styles.headlineText}>Favorites</Text>
          <View style={styles.subtitleRow}>
            <Ionicons name="phone-portrait-outline" size={14} color={colors.secondaryInk} />
            <Text style={styles.subtitleText}>Saved on this device</Text>
            <View style={styles.dot} />
            <Text style={styles.countBadge}>
              {favorites.length} {favorites.length === 1 ? 'Title' : 'Titles'}
            </Text>
          </View>
        </View>

        {/* Sync Status Banner */}
        <SyncBanner />

        {/* Filter Pills */}
        {favorites.length > 0 && (
          <View style={styles.filterPillsRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setFilter('recent')}
              style={({ pressed }) => [
                styles.filterPill,
                filter === 'recent' ? styles.filterPillActive : styles.filterPillInactive,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={filter === 'recent' ? colors.cinemaCanvas : colors.secondaryInk}
              />
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'recent' && styles.filterPillTextActive,
                ]}
              >
                Recently Added
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setFilter('rated')}
              style={({ pressed }) => [
                styles.filterPill,
                filter === 'rated' ? styles.filterPillActive : styles.filterPillInactive,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons
                name="star-outline"
                size={14}
                color={filter === 'rated' ? colors.cinemaCanvas : colors.secondaryInk}
              />
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'rated' && styles.filterPillTextActive,
                ]}
              >
                Highest Rated
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setFilter('runtime')}
              style={({ pressed }) => [
                styles.filterPill,
                filter === 'runtime' ? styles.filterPillActive : styles.filterPillInactive,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons
                name="film-outline"
                size={14}
                color={filter === 'runtime' ? colors.cinemaCanvas : colors.secondaryInk}
              />
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'runtime' && styles.filterPillTextActive,
                ]}
              >
                Feature Length
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 2-Column Grid or Empty State */}
      <FlatList
        data={sortedFavorites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MovieCard movie={item} variant="grid" />}
        ListEmptyComponent={
          <EmptyState
            iconName="heart-dislike-outline"
            title="Your Vault is Empty"
            description="Explore our curated film collection and tap the heart icon on any title to save it here."
            actionLabel="Discover Movies"
            onActionPress={handleBrowseCatalog}
          />
        }
      />
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
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titleSection: {
    marginBottom: 16,
  },
  headlineText: {
    color: colors.primaryInk,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  subtitleText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.secondaryInk,
    opacity: 0.5,
  },
  countBadge: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  filterPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: colors.cinemaAmber,
  },
  filterPillInactive: {
    backgroundColor: colors.quietStage,
  },
  filterPillText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.cinemaCanvas,
  },
  columnWrapper: {
    gap: 12,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
});
