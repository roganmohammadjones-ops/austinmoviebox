import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../theme/tokens';
import { Movie } from '../types';
import { FavoriteButton } from './favorite-button';

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const isSmallDevice = windowWidth <= 360;
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;
  const isLandscape = windowWidth > windowHeight && windowHeight < 550;

  // Responsive hero height (DESIGN.md §29: 45–55% of first viewport height)
  const heroHeight = useMemo(() => {
    if (isLandscape) {
      return Math.max(Math.round(windowHeight * 0.72), 260);
    }
    if (isDesktop) {
      return 460;
    }
    if (isTablet) {
      return 420;
    }
    if (isSmallDevice) {
      return 340;
    }
    const calculated = Math.round(windowHeight * 0.48);
    return Math.min(Math.max(calculated, 350), 450);
  }, [isLandscape, isDesktop, isTablet, isSmallDevice, windowHeight]);

  if (!movie) {
    return null;
  }

  const handlePress = () => {
    if (movie?.id) {
      router.push(`/movie/${movie.id}` as any);
    }
  };

  const duration = movie.durationMinutes || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationStr = duration > 0 ? `${hours}h ${minutes}m` : '';

  const overviewLines = isDesktop || isTablet ? 3 : isSmallDevice ? 1 : 2;
  const genresStr = Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(' • ') : '';
  const ratingStr = typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'NR';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.billboard,
          { height: heroHeight },
        ]}
      >
        <Image
          source={{ uri: movie.backdropUrl }}
          style={styles.backdropImage}
          contentFit="cover"
          transition={400}
        />

        {/* Ambient Theatrical Gradient Scrim */}
        <View style={styles.gradientScrim} />

        {/* Top-Left Live Soundstage Indicator Badge */}
        <View style={styles.spotlightBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.spotlightText}>Spotlight Selection</Text>
        </View>

        {/* Content Over Scrim */}
        <View style={styles.contentOverlay}>
          <Text
            numberOfLines={2}
            style={[
              styles.heroTitle,
              isDesktop && { fontSize: 28 },
              isSmallDevice && { fontSize: 20 },
            ]}
          >
            {movie.title}
          </Text>

          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <Text style={styles.ratingText}>★ {ratingStr}</Text>
            {movie.releaseYear ? (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{movie.releaseYear}</Text>
              </>
            ) : null}
            {genresStr ? (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.genreBadge}>
                  <Text style={styles.genreBadgeText}>{genresStr}</Text>
                </View>
              </>
            ) : null}
            {durationStr ? (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Text style={styles.metaText}>{durationStr}</Text>
              </>
            ) : null}
          </View>

          {/* Short Overview Synopsis (DESIGN.md §29) */}
          {movie.overview ? (
            <Text
              numberOfLines={overviewLines}
              style={[styles.overviewText, isSmallDevice && { fontSize: 12, lineHeight: 16 }]}
            >
              {movie.overview}
            </Text>
          ) : null}

          {/* Action Row: Primary View Details + Favorite Toggle */}
          <View style={[styles.actionsRow, (isDesktop || isTablet) && styles.actionsRowWide]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View details for ${movie.title}`}
              onPress={handlePress}
              style={({ pressed }) => [
                styles.ctaButton,
                isSmallDevice && { height: 44 },
                (isDesktop || isTablet) && styles.ctaButtonWide,
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <Ionicons name="play" size={isSmallDevice ? 17 : 19} color="#FFFFFF" />
              <Text style={styles.ctaButtonText}>View details</Text>
            </Pressable>

            <FavoriteButton
              movie={movie}
              size={isSmallDevice ? 44 : 48}
              iconSize={isSmallDevice ? 18 : 20}
              variant="solid"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  billboard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.raisedStage,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  gradientScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 9, 13, 0.35)',
  },
  spotlightBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20, 25, 35, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
    zIndex: 2,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.ratingGold,
  },
  spotlightText: {
    color: colors.ratingGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(8, 9, 13, 0.86)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(53, 56, 60, 0.3)',
  },
  heroTitle: {
    color: colors.primaryInk,
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  ratingText: {
    color: colors.ratingGold,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  metaDivider: {
    color: colors.mutedInk,
    fontSize: 12,
  },
  metaText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  genreBadge: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genreBadgeText: {
    color: colors.primaryInk,
    fontSize: 11,
    fontWeight: '600',
  },
  overviewText: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  actionsRowWide: {
    width: 'auto',
    alignSelf: 'flex-start',
  },
  ctaButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accentPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    shadowColor: colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonWide: {
    flex: 0,
    minWidth: 160,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
