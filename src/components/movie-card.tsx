import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';
import { Movie } from '../types';
import { FavoriteButton } from './favorite-button';

interface MovieCardProps {
  movie: Movie;
  variant?: 'rail' | 'grid';
  showOverview?: boolean;
  cardWidth?: number;
}

export function MovieCard({ movie, variant = 'rail', cardWidth }: MovieCardProps) {
  const router = useRouter();

  if (!movie) {
    return null;
  }

  const handlePress = () => {
    if (movie?.id) {
      router.push(`/movie/${movie.id}` as any);
    }
  };

  const isRail = variant === 'rail';

  return (
    <Pressable
      accessibilityLabel={`View details for ${movie.title}`}
      onPress={handlePress}
      style={({ pressed }) => [
        isRail ? [styles.railContainer, cardWidth ? { width: cardWidth } : null] : styles.gridContainer,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={styles.posterWrapper}>
        <Image
          source={{ uri: movie.posterUrl }}
          style={styles.posterImage}
          contentFit="cover"
          transition={300}
        />

        {/* Gradient Scrim */}
        <View style={styles.scrimOverlay} />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {movie.rating.toFixed(1)}</Text>
        </View>

        {/* Format Badge if present */}
        {movie.formatBadge && !isRail && (
          <View style={styles.formatBadge}>
            <Text style={styles.formatText}>{movie.formatBadge}</Text>
          </View>
        )}

        {/* Top-Right Favorite Button */}
        <View style={styles.favoritePosition}>
          <FavoriteButton movie={movie} size={36} iconSize={18} />
        </View>
      </View>

      {/* Title & Metadata */}
      <View style={styles.metaContainer}>
        <Text numberOfLines={1} style={styles.titleText}>
          {movie.title}
        </Text>
        <View style={styles.subMetaRow}>
          <Text style={styles.yearText}>{movie.releaseYear}</Text>
          {isRail && <Text style={styles.railRatingText}>★ {movie.rating.toFixed(1)}</Text>}
          {!isRail && movie.genres[0] && (
            <View style={styles.genrePill}>
              <Text style={styles.genrePillText}>{movie.genres[0]}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  railContainer: {
    width: 136,
    marginRight: 12,
  },
  gridContainer: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  posterWrapper: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.quietStage,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  scrimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 18, 20, 0.25)',
  },
  favoritePosition: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(17, 18, 20, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  ratingText: {
    color: colors.ratingGold,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  formatBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(37, 40, 44, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formatText: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '600',
  },
  metaContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  titleText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  yearText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  railRatingText: {
    color: colors.ratingGold,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  genrePill: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genrePillText: {
    color: colors.secondaryInk,
    fontSize: 10,
    fontWeight: '500',
  },
});
