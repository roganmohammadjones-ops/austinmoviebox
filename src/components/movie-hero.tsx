import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { TheatricalVideoPlayer } from './theatrical-video-player';

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(false);

  const isSmallDevice = windowWidth <= 360;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  const isLandscape = windowWidth > windowHeight && windowHeight < 550;

  // Responsive hero height following Stitch's widescreen theatrical billboard
  const heroHeight = useMemo(() => {
    if (isDesktop) return 440;
    if (isTablet) return 400;
    if (isLandscape) return 320;
    // Mobile: generous widescreen theatrical billboard
    return isSmallDevice ? 360 : 380;
  }, [isDesktop, isTablet, isLandscape, isSmallDevice]);

  if (!movie) {
    return null;
  }

  const handleDetailsPress = () => {
    if (movie?.id) {
      router.push(`/movie/${movie.id}` as any);
    }
  };

  const handlePlayTrailer = () => {
    setIsPlayingTrailer(true);
  };

  const duration = movie.durationMinutes || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationStr = duration > 0 ? `${hours}h ${minutes}m` : '';

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
          transition={300}
        />

        {/* Ambient Theatrical Gradient Scrim */}
        <View style={styles.gradientScrim} />

        {/* Structured Flex Tier: Top Bar, Center Play Zone, Bottom Content Shelf */}
        <View style={styles.billboardContent}>
          {/* Top Bar: Spotlight Selection & Live TMDB Indicator */}
          <View style={styles.topBar}>
            <View style={styles.spotlightBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.spotlightText}>Spotlight Selection</Text>
            </View>

            <View style={styles.liveApiBadge}>
              <Ionicons name="film-outline" size={11} color={colors.cinemaAmber} />
              <Text style={styles.liveApiBadgeText}>TMDB Live</Text>
            </View>
          </View>

          {/* Dedicated Play Zone (Centered with ample breathing room, text cannot cover) */}
          <View style={styles.playZone}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Play official trailer for ${movie.title}`}
              onPress={handlePlayTrailer}
              hitSlop={14}
              style={({ pressed }) => [
                styles.centerPlayButton,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] },
              ]}
            >
              <View style={styles.centerPlayCircle}>
                <Ionicons name="play" size={30} color={colors.cinemaCanvas} style={{ marginLeft: 3 }} />
              </View>
              <View style={styles.playBadge}>
                <Ionicons name="videocam-outline" size={11} color={colors.cinemaAmber} />
                <Text style={styles.playBadgeText}>PLAY TRAILER</Text>
              </View>
            </Pressable>
          </View>

          {/* Bottom Content Shelf */}
          <View style={styles.contentOverlay}>
            <Text
              numberOfLines={1}
              style={[
                styles.heroTitle,
                isDesktop && { fontSize: 24 },
                isSmallDevice && { fontSize: 18 },
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

            {/* Action Row: Watch Trailer CTA + Details + Favorite Toggle */}
            <View style={[styles.actionsRow, (isDesktop || isTablet) && styles.actionsRowWide]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Watch trailer for ${movie.title}`}
                onPress={handlePlayTrailer}
                style={({ pressed }) => [
                  styles.ctaButton,
                  isSmallDevice && { height: 42 },
                  (isDesktop || isTablet) && styles.ctaButtonWide,
                  { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <Ionicons name="play" size={isSmallDevice ? 16 : 18} color={colors.cinemaCanvas} />
                <Text style={styles.ctaButtonText}>Watch Trailer</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View details for ${movie.title}`}
                onPress={handleDetailsPress}
                style={({ pressed }) => [
                  styles.secondaryDetailsBtn,
                  isSmallDevice && { height: 42 },
                  { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <Ionicons name="information-circle-outline" size={17} color={colors.primaryInk} />
                <Text style={styles.secondaryDetailsText}>Details</Text>
              </Pressable>

              <FavoriteButton
                movie={movie}
                size={isSmallDevice ? 42 : 44}
                iconSize={isSmallDevice ? 18 : 20}
                variant="solid"
              />
            </View>
          </View>
        </View>
      </View>

      {/* In-App Theatrical Video Player Modal */}
      <TheatricalVideoPlayer
        movie={movie}
        visible={isPlayingTrailer}
        onClose={() => setIsPlayingTrailer(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  billboard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.raisedStage,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  backdropImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  gradientScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(14, 15, 18, 0.45)',
  },
  billboardContent: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 12,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 40, 44, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  spotlightText: {
    color: colors.secondaryInk,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  liveApiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(23, 24, 28, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(215, 163, 91, 0.3)',
  },
  liveApiBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'Courier',
  },
  playZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    zIndex: 11,
  },
  centerPlayButton: {
    alignItems: 'center',
    gap: 8,
  },
  centerPlayCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.cinemaAmber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(17, 18, 20, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  playBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  contentOverlay: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(14, 15, 17, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(53, 56, 60, 0.35)',
    zIndex: 12,
  },
  heroTitle: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  ratingText: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  metaDivider: {
    color: colors.mutedInk,
    fontSize: 11,
  },
  metaText: {
    color: colors.secondaryInk,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  genreBadge: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  genreBadgeText: {
    color: colors.primaryInk,
    fontSize: 10,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  actionsRowWide: {
    width: 'auto',
    alignSelf: 'flex-start',
  },
  ctaButton: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaButtonWide: {
    flex: 0,
    minWidth: 140,
    paddingHorizontal: 18,
  },
  ctaButtonText: {
    color: colors.cinemaCanvas,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryDetailsBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.quietStage,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  secondaryDetailsText: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '600',
  },
});
