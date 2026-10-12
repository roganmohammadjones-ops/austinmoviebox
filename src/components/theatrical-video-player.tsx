import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchMovieTrailerKey, openMovieTrailer } from '../services/movie-api';
import { useAuthStore } from '../stores/auth-store';
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
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user, signInWithYouTube } = useAuthStore();
  const isYouTubeConnected = Boolean(
    user &&
      (user.user_metadata?.youtube_connected ||
        user.app_metadata?.provider === 'youtube' ||
        user.app_metadata?.provider === 'google' ||
        user.email?.toLowerCase().includes('@gmail.com'))
  );

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
            <View style={styles.nativeStage}>
              {movie.backdropUrl ? (
                <Image
                  source={{ uri: movie.backdropUrl }}
                  style={styles.nativeBackdrop}
                  contentFit="cover"
                  transition={300}
                />
              ) : null}
              <View style={styles.nativeScrim} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Play official trailer in full screen"
                onPress={() => {
                  const targetMovie = trailerKey ? { ...movie, youtubeKey: trailerKey } : movie;
                  openMovieTrailer(targetMovie);
                }}
                style={({ pressed }) => [
                  styles.nativePlayCta,
                  { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
              >
                <View style={styles.nativePlayCircle}>
                  <Ionicons name="play" size={32} color={colors.cinemaCanvas} style={{ marginLeft: 3 }} />
                </View>
                <View style={styles.nativePlayBadge}>
                  <Ionicons name="logo-youtube" size={14} color="#FF0000" />
                  <Text style={styles.nativePlayText}>
                    {isYouTubeConnected ? 'LAUNCH TRAILER IN FULLSCREEN' : 'LAUNCH TRAILER (YOUTUBE REQUIRED)'}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>

        {/* Movie Info & Control Shelf */}
        <ScrollView
          style={styles.infoScroll}
          contentContainerStyle={styles.infoShelfContent}
          showsVerticalScrollIndicator={false}
        >
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open trailer directly on YouTube"
                onPress={() => {
                  const targetMovie = trailerKey ? { ...movie, youtubeKey: trailerKey } : movie;
                  openMovieTrailer(targetMovie);
                }}
                style={({ pressed }) => [styles.youtubeBtn, { opacity: pressed ? 0.75 : 1 }]}
              >
                <Ionicons name="logo-youtube" size={19} color="#FF0000" />
              </Pressable>

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

          {/* YouTube Streaming Requirement Banner / Verification Indicator */}
          {isYouTubeConnected ? (
            <View style={styles.verifiedShelf}>
              <View style={styles.verifiedLeft}>
                <Ionicons name="shield-checkmark" size={14} color="#34C759" />
                <Text style={styles.verifiedText}>
                  YouTube Stream Active:{' '}
                  <Text style={styles.verifiedUser}>
                    {user?.email || (user?.user_metadata?.name ? `${user.user_metadata.name}@gmail.com` : 'Verified Curator')}
                  </Text>
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>UNRESTRICTED HD</Text>
              </View>
            </View>
          ) : (
            <View style={styles.authNoticeCard}>
              <View style={styles.authNoticeTop}>
                <View style={styles.authNoticeHeader}>
                  <View style={styles.youtubeMiniBadge}>
                    <Ionicons name="logo-youtube" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.authNoticeTitle}>YOUTUBE / GMAIL LOGIN REQUIRED</Text>
                </View>
                <View style={styles.authNoticeBadge}>
                  <Text style={styles.authNoticeBadgeText}>RESTRICTED STREAMS</Text>
                </View>
              </View>
              <Text style={styles.authNoticeDesc}>
                Age-restricted trailers & official studio previews require an authenticated YouTube or Gmail account.
              </Text>
              <View style={styles.authNoticeActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Sign in with YouTube or Gmail"
                  onPress={() => {
                    onClose();
                    router.push('/auth' as any);
                  }}
                  style={({ pressed }) => [
                    styles.authNoticeBtn,
                    { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Ionicons name="logo-youtube" size={14} color="#FFFFFF" />
                  <Text style={styles.authNoticeBtnText}>Sign in with YouTube / Gmail</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Quick connect YouTube"
                  onPress={async () => {
                    await signInWithYouTube();
                  }}
                  style={({ pressed }) => [
                    styles.quickConnectBtn,
                    { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
                  ]}
                >
                  <Ionicons name="flash" size={12} color={colors.cinemaAmber} />
                  <Text style={styles.quickConnectBtnText}>1-Tap Link</Text>
                </Pressable>
              </View>
            </View>
          )}

          {movie.overview ? (
            <Text
              numberOfLines={isSmallDevice ? 3 : 4}
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
        </ScrollView>
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
  nativeStage: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeBackdrop: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  nativeScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 12, 0.65)',
  },
  nativePlayCta: {
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  nativePlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cinemaAmber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cinemaAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  nativePlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(17, 18, 20, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.7)',
  },
  nativePlayText: {
    color: colors.primaryInk,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Courier',
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
  infoScroll: {
    flex: 1,
    backgroundColor: colors.cinemaCanvas,
  },
  infoShelfContent: {
    padding: 20,
    paddingBottom: 28,
    gap: 12,
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
  youtubeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.quietStage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
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
  verifiedShelf: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  verifiedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  verifiedText: {
    color: colors.primaryInk,
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedUser: {
    color: '#34C759',
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  verifiedBadgeText: {
    color: '#34C759',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Courier',
    letterSpacing: 0.6,
  },
  authNoticeCard: {
    backgroundColor: '#1C1517',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
    gap: 8,
  },
  authNoticeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  youtubeMiniBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authNoticeTitle: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'Courier',
  },
  authNoticeBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  authNoticeBadgeText: {
    color: '#FF6B6B',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  authNoticeDesc: {
    color: colors.primaryInk,
    fontSize: 12,
    lineHeight: 16,
  },
  authNoticeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  authNoticeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FF0000',
    height: 38,
    borderRadius: 10,
  },
  authNoticeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quickConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.quietStage,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.8)',
  },
  quickConnectBtnText: {
    color: colors.primaryInk,
    fontSize: 11,
    fontWeight: '600',
  },
});
