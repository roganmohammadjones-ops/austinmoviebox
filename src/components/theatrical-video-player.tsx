import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { fetchMovieTrailerKey } from '../services/movie-api';
import { colors } from '../theme/tokens';
import { Movie } from '../types';
import { FavoriteButton } from './favorite-button';

interface TheatricalVideoPlayerProps {
  movie: Movie | null;
  visible: boolean;
  onClose: () => void;
}

export function TheatricalVideoPlayer({
  movie,
  visible,
  onClose,
}: TheatricalVideoPlayerProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSmallDevice = windowWidth <= 360;
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    let isCancelled = false;

    async function resolveTrailer() {
      if (!visible || !movie) {
        setTrailerKey(null);
        setIsLoading(false);
        return;
      }

      // Check if trailerKey is already cached on the movie
      if (movie.youtubeKey) {
        setTrailerKey(movie.youtubeKey);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const key = await fetchMovieTrailerKey(movie.id);
        if (!isCancelled) {
          setTrailerKey(key);
        }
      } catch (err) {
        console.error('[TheatricalVideoPlayer] Error fetching trailer key:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    resolveTrailer();

    return () => {
      isCancelled = true;
    };
  }, [visible, movie]);

  if (!visible || !movie) {
    return null;
  }

  const embedUrl = trailerKey
    ? `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&showinfo=0&origin=https://austinmoviebox.app`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
        `${movie.title} ${movie.releaseYear || ''} official trailer`
      )}&autoplay=1&playsinline=1&controls=1`;

  const handleShare = async () => {
    try {
      await Share.share({
        title: movie.title,
        message: `Watching "${movie.title}" on Austin MovieBox! Rated ★ ${movie.rating.toFixed(1)}/10.`,
      });
    } catch {
      // dismissed
    }
  };

  const durationStr =
    movie.durationMinutes > 0
      ? `${Math.floor(movie.durationMinutes / 60)}h ${movie.durationMinutes % 60}m`
      : '';

  // Maximize player container on mobile while keeping 16:9 ratio
  const maxPlayerWidth = Math.min(windowWidth, 900);
  const playerHeight = Math.min(Math.round(maxPlayerWidth * (9 / 16)), windowHeight * 0.55);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.modalRoot}>
        {/* Theatrical Top Navigation Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.liveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveBadgeText}>IN-APP STREAM</Text>
            </View>
            <Text numberOfLines={1} style={styles.movieHeaderTitle}>
              {movie.title}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close player"
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="close" size={24} color={colors.primaryInk} />
          </Pressable>
        </View>

        {/* Video Player Stage */}
        <View style={[styles.playerContainer, { height: playerHeight, width: maxPlayerWidth }]}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.cinemaAmber} />
              <Text style={styles.loadingText}>Accessing Theatrical Stream...</Text>
            </View>
          ) : Platform.OS === 'web' ? (
            <iframe
              src={embedUrl}
              title={`${movie.title} Trailer`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: colors.cinemaCanvas,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <WebView
              source={{ uri: embedUrl }}
              style={styles.webView}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.cinemaAmber} />
                </View>
              )}
            />
          )}
        </View>

        {/* Movie Info & Control Shelf */}
        <View style={styles.infoShelf}>
          <View style={styles.titleRow}>
            <View style={styles.titleGroup}>
              <Text numberOfLines={1} style={[styles.titleText, isDesktop && { fontSize: 24 }]}>
                {movie.title}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.ratingText}>★ {movie.rating.toFixed(1)}</Text>
                {movie.releaseYear ? (
                  <>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{movie.releaseYear}</Text>
                  </>
                ) : null}
                {durationStr ? (
                  <>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>{durationStr}</Text>
                  </>
                ) : null}
                {Array.isArray(movie.genres) && movie.genres[0] ? (
                  <>
                    <Text style={styles.metaDot}>•</Text>
                    <View style={styles.genrePill}>
                      <Text style={styles.genrePillText}>{movie.genres[0]}</Text>
                    </View>
                  </>
                ) : null}
              </View>
            </View>

            <View style={styles.actionRow}>
              <FavoriteButton movie={movie} size={44} iconSize={20} variant="solid" />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share movie"
                onPress={handleShare}
                style={({ pressed }) => [styles.shareBtn, { opacity: pressed ? 0.75 : 1 }]}
              >
                <Ionicons name="share-social-outline" size={20} color={colors.primaryInk} />
              </Pressable>
            </View>
          </View>

          {movie.overview ? (
            <Text
              numberOfLines={isSmallDevice ? 2 : 3}
              style={styles.overviewText}
            >
              {movie.overview}
            </Text>
          ) : null}

          {/* Return to Discovery Action */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close player and return"
            onPress={onClose}
            style={({ pressed }) => [
              styles.dismissBtn,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Ionicons name="chevron-down" size={18} color={colors.cinemaCanvas} />
            <Text style={styles.dismissBtnText}>Return to Austin MovieBox</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.raisedStage,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.4)',
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.6)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  liveBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
  },
  movieHeaderTitle: {
    color: colors.primaryInk,
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  playerContainer: {
    alignSelf: 'center',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.4)',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.raisedStage,
    gap: 12,
  },
  loadingText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  infoShelf: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.cinemaCanvas,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  titleText: {
    color: colors.primaryInk,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  ratingText: {
    color: colors.cinemaAmber,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  metaDot: {
    color: colors.mutedInk,
    fontSize: 12,
  },
  metaText: {
    color: colors.secondaryInk,
    fontSize: 12,
    fontFamily: 'Courier',
  },
  genrePill: {
    backgroundColor: colors.quietStage,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  genrePillText: {
    color: colors.primaryInk,
    fontSize: 10,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  overviewText: {
    color: colors.secondaryInk,
    fontSize: 13,
    lineHeight: 19,
    marginVertical: 12,
  },
  dismissBtn: {
    width: '100%',
    height: 48,
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
    marginTop: 'auto',
  },
  dismissBtnText: {
    color: colors.cinemaCanvas,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
