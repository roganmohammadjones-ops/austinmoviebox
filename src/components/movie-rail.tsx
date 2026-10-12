import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../theme/tokens';
import { Movie } from '../types';
import { MovieCard } from './movie-card';

interface MovieRailProps {
  title: string;
  movies: Movie[];
  onSeeAllPress?: () => void;
}

export function MovieRail({ title, movies, onSeeAllPress }: MovieRailProps) {
  const { width: windowWidth } = useWindowDimensions();

  const isSmallDevice = windowWidth <= 360;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Responsive card width calculation:
  // - Small phones (<= 360px): 124px (2 cards + 3rd peek)
  // - Standard phones (361px - 430px): 138px
  // - Large phones / phablets (431px - 640px): 148px
  // - Tablets (641px - 1024px): 164px
  // - Desktop (>= 1024px): 184px
  const cardWidth = useMemo(() => {
    if (isDesktop) return 184;
    if (isTablet) return 164;
    if (windowWidth > 430) return 148;
    if (isSmallDevice) return 124;
    return 138;
  }, [isDesktop, isTablet, isSmallDevice, windowWidth]);

  const horizontalPadding = useMemo(() => {
    if (isDesktop) return 32;
    if (isTablet) return 24;
    if (isSmallDevice) return 16;
    return 20;
  }, [isDesktop, isTablet, isSmallDevice]);

  const snapInterval = cardWidth + 12;

  const safeMovies = useMemo(() => {
    return Array.isArray(movies) ? movies.filter((m) => !!m && !!m.id) : [];
  }, [movies]);

  if (safeMovies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={[styles.headerRow, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.titleGroup}>
          <View style={styles.amberBar} />
          <Text
            style={[
              styles.titleText,
              isDesktop && { fontSize: 20 },
              isSmallDevice && { fontSize: 16 },
            ]}
          >
            {title}
          </Text>
        </View>

        {onSeeAllPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all ${title}`}
            onPress={onSeeAllPress}
            style={({ pressed }) => [styles.seeAllButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.cinemaAmber} />
          </Pressable>
        )}
      </View>

      {/* Horizontal Rail */}
      <FlatList
        data={safeMovies}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={Platform.OS === 'web' ? 'normal' : 'fast'}
        snapToInterval={Platform.OS === 'web' ? undefined : snapInterval}
        snapToAlignment={Platform.OS === 'web' ? undefined : 'start'}
        contentContainerStyle={[
          styles.railContent,
          {
            paddingLeft: horizontalPadding,
            paddingRight: Math.max(horizontalPadding - 12, 8),
          },
        ]}
        renderItem={({ item }) => <MovieCard movie={item} variant="rail" cardWidth={cardWidth} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amberBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.cinemaAmber,
  },
  titleText: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 36,
    paddingHorizontal: 4,
  },
  seeAllText: {
    color: colors.cinemaAmber,
    fontSize: 13,
    fontWeight: '600',
  },
  railContent: {
    paddingVertical: 2,
  },
});
