import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoritesEmptyVault } from '../../components/favorites-empty-vault';
import { MovieCard } from '../../components/movie-card';
import { SyncBanner } from '../../components/sync-banner';
import { useAuthStore } from '../../stores/auth-store';
import { useFavoritesStore } from '../../stores/favorites-store';
import { colors } from '../../theme/tokens';
import { Movie } from '../../types';

type FilterType = 'all' | 'recent' | 'rated' | 'runtime';

const EMPTY_FAVORITES: Movie[] = [];

export default function FavoritesScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuthStore();
  const rawFavorites = useFavoritesStore((state) => state.favorites);
  const syncWithCloud = useFavoritesStore((state) => state.syncWithCloud);
  const favorites = Array.isArray(rawFavorites) ? rawFavorites : EMPTY_FAVORITES;

  const [filter, setFilter] = useState<FilterType>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToastVisible, setSyncToastVisible] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState('');

  const sortedFavorites = useMemo(() => {
    const list = [...favorites];
    if (filter === 'rated') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (filter === 'runtime') {
      return list.sort((a, b) => (b.durationMinutes || 0) - (a.durationMinutes || 0));
    }
    return list; // 'all' or 'recent'
  }, [favorites, filter]);

  const handleSyncPress = async () => {
    if (isGuest || !user) {
      router.push('/auth' as any);
      return;
    }

    setIsSyncing(true);
    try {
      await syncWithCloud(user.id);
      setSyncToastMessage(
        `Sync completed: ${favorites.length} titles synchronized with cloud collection`
      );
      setSyncToastVisible(true);
      setTimeout(() => {
        setSyncToastVisible(false);
      }, 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBrowseCatalog = () => {
    router.push('/(tabs)' as any);
  };

  const handleQuickJump = (query: string) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { q: query },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Floating Sync Toast Notification */}
        {syncToastVisible && (
          <View style={styles.syncToast}>
            <View style={styles.syncToastLeft}>
              <View style={styles.syncToastIconCircle}>
                <Ionicons name="cloud-done" size={16} color={colors.cinemaAmber} />
              </View>
              <Text numberOfLines={1} style={styles.syncToastText}>
                {syncToastMessage}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss toast"
              onPress={() => setSyncToastVisible(false)}
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color={colors.mutedInk} />
            </Pressable>
          </View>
        )}

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTopRow}>
            <View style={styles.titleSection}>
              <Text style={styles.headlineText}>Favorites</Text>
              <View style={styles.subtitleRow}>
                <Ionicons
                  name={isGuest ? 'phone-portrait-outline' : 'cloud-done-outline'}
                  size={14}
                  color={isGuest ? colors.secondaryInk : colors.cinemaAmber}
                />
                <Text style={styles.subtitleText}>
                  {isGuest
                    ? 'Saved on this device'
                    : `Synced to account · ${favorites.length} titles`}
                </Text>
              </View>
            </View>

            {/* Quick Re-sync Action */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Re-synchronize favorites"
              disabled={isSyncing}
              onPress={handleSyncPress}
              style={({ pressed }) => [
                styles.resyncBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.cinemaAmber} />
              ) : (
                <>
                  <Ionicons name="sync" size={15} color={colors.cinemaAmber} />
                  <Text style={styles.resyncText}>
                    {isGuest ? 'Sign in to sync' : 'Just now'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Sync Status Banner */}
          <SyncBanner />

          {/* Filter Pills matching Stitch */}
          {favorites.length > 0 && (
            <View style={styles.filterPillsRow}>
              {/* All Titles */}
              <Pressable
                accessibilityRole="button"
                onPress={() => setFilter('all')}
                style={({ pressed }) => [
                  styles.filterPill,
                  filter === 'all' ? styles.filterPillActive : styles.filterPillInactive,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === 'all' && styles.filterPillTextActive,
                  ]}
                >
                  All Titles
                </Text>
                <View
                  style={[
                    styles.countPill,
                    filter === 'all' ? styles.countPillActive : styles.countPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countPillText,
                      filter === 'all' ? styles.countPillTextActive : styles.countPillTextInactive,
                    ]}
                  >
                    {favorites.length}
                  </Text>
                </View>
              </Pressable>

              {/* Recently Added */}
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
                  size={13}
                  color={filter === 'recent' ? colors.cinemaCanvas : colors.secondaryInk}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    filter === 'recent' && styles.filterPillTextActive,
                  ]}
                >
                  Recent
                </Text>
              </Pressable>

              {/* Highest Rated */}
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
                  size={13}
                  color={filter === 'rated' ? colors.cinemaCanvas : colors.secondaryInk}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    filter === 'rated' && styles.filterPillTextActive,
                  ]}
                >
                  Top Rated
                </Text>
              </Pressable>

              {/* Feature Length */}
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
                  size={13}
                  color={filter === 'runtime' ? colors.cinemaCanvas : colors.secondaryInk}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    filter === 'runtime' && styles.filterPillTextActive,
                  ]}
                >
                  Runtime
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
            <FavoritesEmptyVault
              onDiscoverPress={handleBrowseCatalog}
              onQuickJumpPress={handleQuickJump}
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
  syncToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.raisedStage,
    borderWidth: 1,
    borderColor: 'rgba(215, 163, 91, 0.3)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  syncToastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  syncToastIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(215, 163, 91, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncToastText: {
    flex: 1,
    color: colors.primaryInk,
    fontSize: 12,
    fontWeight: '500',
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleSection: {
    flex: 1,
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
  resyncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  resyncText: {
    color: colors.secondaryInk,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
    flexWrap: 'wrap',
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
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  countPillActive: {
    backgroundColor: 'rgba(17, 18, 20, 0.25)',
  },
  countPillInactive: {
    backgroundColor: 'rgba(53, 56, 60, 0.6)',
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  countPillTextActive: {
    color: colors.cinemaCanvas,
  },
  countPillTextInactive: {
    color: colors.mutedInk,
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
