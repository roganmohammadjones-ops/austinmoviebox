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

  // Responsive card width matching Stitch's w-[132px] design:
  // - Small phones (<= 360px): 120px
  // - Standard phones (361px - 430px): 132px (Stitch specification)
  // - Large phones / phablets (431px - 767px): 140px
  // - Tablets (768px - 1023px): 156px
  // - Desktop (>= 1024px): 176px
  const cardWidth = useMemo(() => {
    if (isDesktop) return 176;
    if (isTablet) return 156;
    if (windowWidth > 430) return 140;
    if (isSmallDevice) return 120;
    return 132;
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
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    alignItems: 'flex-start',
  },
});
