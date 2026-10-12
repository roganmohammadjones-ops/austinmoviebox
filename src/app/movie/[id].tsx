import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchMovieDetails, openMovieTrailer } from '../../services/movie-api';
import { useAuthStore } from '../../stores/auth-store';
import { useFavoritesStore } from '../../stores/favorites-store';
import { colors } from '../../theme/tokens';
import { Movie } from '../../types';

export default function MovieDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const isFavorite = useFavoritesStore((state) =>
    movie?.id && typeof state?.isFavorite === 'function' ? state.isFavorite(movie.id) : false
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    let isCancelled = false;

    async function loadMovie() {
      if (!id) {
        setIsLoading(false);
        setError('Missing movie identifier.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMovieDetails(String(id));
        if (!isCancelled) {
          setMovie(data);
          if (!data) {
            setError('The requested movie entry could not be found on TMDB.');
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('[MovieDetailScreen] Error fetching movie details:', err);
          setError(err?.message || 'Failed to load movie from TMDB.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.cinemaAmber} />
          <Text style={styles.loadingText}>Retrieving TMDB Archival Entry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="film-outline" size={48} color={colors.cinemaAmber} />
          <Text style={styles.errorTitle}>Movie Not Found</Text>
          <Text style={styles.errorSub}>
            {error || 'The requested cinema entry could not be located.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButtonSimple}
          >
            <Text style={styles.backButtonSimpleText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const durationStr =
    movie.durationMinutes > 0
      ? `${Math.floor(movie.durationMinutes / 60)}h ${movie.durationMinutes % 60}m`
      : 'N/A';

  const handleFavoritePress = () => {
    toggleFavorite(movie, user?.id);
  };

  const handlePlayTrailer = () => {
    if (movie) {
      openMovieTrailer(movie);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: movie.title,
        message: `Check out "${movie.title}" (${movie.releaseYear || 'TMDB'}) on Austin MovieBox! Rated ★ ${movie.rating.toFixed(1)}/10.`,
      });
    } catch {
      // share dismissed
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primaryInk} />
          </Pressable>

          <Text style={styles.headerTitleText}>Movie Details</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share movie"
            onPress={handleShare}
            style={({ pressed }) => [styles.shareHeaderBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="share-outline" size={20} color={colors.primaryInk} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Backdrop Banner with Centered Theatrical Video Play Button */}
          <View style={styles.backdropContainer}>
            {movie.backdropUrl ? (
              <Image
                source={{ uri: movie.backdropUrl }}
                style={styles.backdropImage}
                contentFit="cover"
                transition={500}
              />
            ) : null}
            <View style={styles.backdropScrimTop} />
            <View style={styles.backdropScrimBottom} />
            <View style={styles.ambientGlow} />

            {/* Centered Theatrical Video Play Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Watch official trailer for ${movie.title}`}
              onPress={handlePlayTrailer}
              style={({ pressed }) => [
                styles.backdropPlayBtn,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] },
              ]}
            >
              <View style={styles.backdropPlayCircle}>
                <Ionicons name="play" size={32} color={colors.cinemaCanvas} style={{ marginLeft: 3 }} />
              </View>
              <View style={styles.backdropPlayBadge}>
                <Ionicons name="videocam-outline" size={12} color={colors.cinemaAmber} />
                <Text style={styles.backdropPlayBadgeText}>WATCH TRAILER</Text>
              </View>
            </Pressable>
          </View>

          {/* Floating Movie Header Block */}
          <View style={styles.headerBlock}>
            {/* Tag row */}
            <View style={styles.tagRow}>
              <View style={styles.screeningBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.screeningText}>Theatrical Catalog</Text>
              </View>
              {movie.formatBadge && (
                <>
                  <Text style={styles.tagBullet}>•</Text>
                  <Text style={styles.formatText}>{movie.formatBadge}</Text>
                </>
              )}
            </View>

            {/* Title and Tagline */}
            <Text style={styles.movieTitle}>{movie.title}</Text>
            {movie.tagline && <Text style={styles.taglineText}>“{movie.tagline}”</Text>}

            {/* Numeric Metadata Row */}
            <View style={styles.metadataCard}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={15} color={colors.cinemaAmber} />
                <Text style={styles.ratingScore}>{movie.rating.toFixed(1)}</Text>
                <Text style={styles.ratingMax}>/ 10</Text>
              </View>

              <Text style={styles.metaPipe}>|</Text>

              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.mutedInk} />
                <Text style={styles.metaItemText}>
                  {movie.releaseDate || (movie.releaseYear > 0 ? movie.releaseYear : 'N/A')}
                </Text>
              </View>

              <Text style={styles.metaPipe}>|</Text>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={colors.mutedInk} />
                <Text style={styles.metaItemText}>{durationStr}</Text>
              </View>

              {movie.ageRating && (
                <>
                  <Text style={styles.metaPipe}>|</Text>
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageBadgeText}>{movie.ageRating}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Genre Badges */}
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genresRow}>
                {movie.genres.map((g) => (
                  <View key={g} style={styles.genreBadge}>
                    <Text style={styles.genreBadgeText}>{g}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 52px Primary Action Bar: Watch Trailer, Favorite, Share */}
            <View style={styles.actionBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Watch trailer"
                onPress={handlePlayTrailer}
                style={({ pressed }) => [
                  styles.primaryPlayTrailerBtn,
                  { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <Ionicons name="play" size={20} color={colors.cinemaCanvas} />
                <Text style={styles.primaryPlayTrailerText}>Watch Trailer</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                onPress={handleFavoritePress}
                style={({ pressed }) => [
                  styles.primaryFavBtn,
                  isFavorite && styles.primaryFavBtnActive,
                  { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.cinemaAmber : colors.primaryInk}
                />
                <Text
                  style={[
                    styles.primaryFavBtnText,
                    isFavorite && styles.primaryFavBtnTextActive,
                  ]}
                >
                  {isFavorite ? 'Saved' : 'Save'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share movie"
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.shareBtn,
                  { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                <Ionicons name="share-social-outline" size={20} color={colors.primaryInk} />
              </Pressable>
            </View>

            {/* Overview Block */}
            <View style={styles.overviewSection}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Overview</Text>
                <Text style={styles.archivalLogText}>TMDB SYNOPSIS</Text>
              </View>
              <Text style={styles.overviewBody}>
                {movie.overview || 'No synopsis provided for this title.'}
              </Text>
            </View>

            {/* Technical Specs & Production Card */}
            <View style={styles.specsCard}>
              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>DIRECTOR</Text>
                  <Text style={styles.specValue}>{movie.director || 'N/A'}</Text>
                  <Text style={styles.specSub}>Direction</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>CINEMATOGRAPHY</Text>
                  <Text style={styles.specValue}>{movie.cinematography || 'N/A'}</Text>
                  <Text style={styles.specSub}>Camera & Visuals</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>PRODUCTION SOUND</Text>
                  <Text style={styles.specValue}>{movie.sound || 'N/A'}</Text>
                  <Text style={styles.specSub}>Original Score</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>STUDIO</Text>
                  <Text style={styles.specValue}>{movie.studio || 'N/A'}</Text>
                  <Text style={styles.specSub}>Production</Text>
                </View>
              </View>
            </View>

            {/* Cast & Crew Shelf */}
            {movie.cast && movie.cast.length > 0 && (
              <View style={styles.castSection}>
                <View style={styles.castHeader}>
                  <Text style={styles.castTitle}>Cast & Crew</Text>
                  <Text style={styles.castCreditsCount}>{movie.cast.length} CREDITS</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.castScroll}
                >
                  {movie.cast.map((actor, idx) => (
                    <View key={idx} style={styles.castCard}>
                      {actor.avatarUrl ? (
                        <Image
                          source={{ uri: actor.avatarUrl }}
                          style={styles.castAvatar}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[styles.castAvatar, styles.placeholderAvatar]}>
                          <Ionicons name="person" size={24} color={colors.mutedInk} />
                        </View>
                      )}
                      <Text numberOfLines={1} style={styles.castName}>
                        {actor.name}
                      </Text>
                      <Text numberOfLines={1} style={styles.castCharacter}>
                        {actor.character}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loadingText: {
    color: colors.secondaryInk,
    fontSize: 13,
    letterSpacing: 0.8,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.3)',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    color: colors.primaryInk,
    fontSize: 16,
    fontWeight: '600',
  },
  shareHeaderBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  backdropContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: colors.surfaceContainerLowest,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropScrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(17, 18, 20, 0.6)',
  },
  backdropScrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(17, 18, 20, 0.95)',
  },
  ambientGlow: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    width: 200,
    height: 40,
    backgroundColor: 'rgba(215, 163, 91, 0.15)',
    borderRadius: 20,
  },
  headerBlock: {
    paddingHorizontal: 20,
    marginTop: -20,
    zIndex: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  screeningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  screeningText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  tagBullet: {
    color: colors.mutedInk,
    fontSize: 12,
  },
  formatText: {
    color: colors.secondaryInk,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  movieTitle: {
    color: colors.primaryInk,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  taglineText: {
    color: colors.secondaryInk,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  metadataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: colors.raisedStage,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    color: colors.primaryInk,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  ratingMax: {
    color: colors.mutedInk,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  metaPipe: {
    color: colors.frameBorder,
    fontSize: 13,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  ageBadge: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ageBadgeText: {
    color: colors.primaryInk,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  genreBadge: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  genreBadgeText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontWeight: '600',
  },
  backdropPlayBtn: {
    position: 'absolute',
    alignSelf: 'center',
    top: '32%',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  backdropPlayCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  backdropPlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(17, 18, 20, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  backdropPlayBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  primaryPlayTrailerBtn: {
    flex: 1.6,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.cinemaAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryPlayTrailerText: {
    color: colors.cinemaCanvas,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryFavBtn: {
    flex: 1.1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.quietStage,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  primaryFavBtnActive: {
    backgroundColor: colors.quietStage,
    borderColor: colors.cinemaAmber,
  },
  primaryFavBtnText: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryFavBtnTextActive: {
    color: colors.cinemaAmber,
  },
  shareBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overviewTitle: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
  },
  archivalLogText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  overviewBody: {
    color: colors.secondaryInk,
    fontSize: 15,
    lineHeight: 24,
  },
  specsCard: {
    backgroundColor: colors.raisedStage,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  specItem: {
    width: '50%',
  },
  specLabel: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
    fontFamily: 'Courier',
  },
  specValue: {
    color: colors.primaryInk,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  specSub: {
    color: colors.secondaryInk,
    fontSize: 11,
  },
  castSection: {
    marginBottom: 20,
  },
  castHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  castTitle: {
    color: colors.primaryInk,
    fontSize: 18,
    fontWeight: '700',
  },
  castCreditsCount: {
    color: colors.mutedInk,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  castScroll: {
    gap: 16,
  },
  castCard: {
    width: 76,
    alignItems: 'center',
  },
  castAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.quietStage,
    marginBottom: 6,
  },
  placeholderAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  castName: {
    color: colors.primaryInk,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  castCharacter: {
    color: colors.secondaryInk,
    fontSize: 10,
    textAlign: 'center',
    width: '100%',
    marginTop: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    color: colors.primaryInk,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  errorSub: {
    color: colors.secondaryInk,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonSimple: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.cinemaAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSimpleText: {
    color: colors.cinemaCanvas,
    fontSize: 14,
    fontWeight: '700',
  },
});
