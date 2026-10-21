import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Constants from 'expo-constants';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { fetchMovieTrailerKeys } from '../services/movie-api';
import { createTrailerDocument, isYouTubeVideoId, trailerPlaybackError } from '../services/trailer-player';
import { usePreferencesStore } from '../stores/preferences-store';
import { colors } from '../theme/tokens';
import { Movie } from '../types';
import { FavoriteButton } from './favorite-button';

interface TheatricalVideoPlayerProps {
  movie: Movie | null;
  visible: boolean;
  onClose: () => void;
}

export function TheatricalVideoPlayer({ movie, visible, onClose }: TheatricalVideoPlayerProps) {
  const [attempt, setAttempt] = useState(0);
  if (!visible || !movie) return null;
  return <TrailerPlayer key={`${movie.id}-${movie.youtubeKey ?? ''}-${attempt}`} movie={movie} onClose={onClose} onRetry={() => setAttempt((value) => value + 1)} />;
}

function TrailerPlayer({ movie, onClose, onRetry }: { movie: Movie; onClose: () => void; onRetry: () => void }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [trailerKeys, setTrailerKeys] = useState<string[]>([]);
  const [trailerIndex, setTrailerIndex] = useState(0);
  const trailerKey = trailerKeys[trailerIndex];
  const [isLoading, setIsLoading] = useState(true);
  const [playback, setPlayback] = useState('Loading trailer…');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoplay = usePreferencesStore((state) => state.autoplayTrailers);
  const instanceId = useId();
  const movieId = movie?.id;
  const cachedKey = movie?.youtubeKey;
  const cachedKeys = movie.youtubeKeys;
  const messageId = `${instanceId}-${movieId}-${trailerIndex}`;
  const appId = Platform.OS === 'ios'
    ? Constants.expoConfig?.ios?.bundleIdentifier
    : Constants.expoConfig?.android?.package;
  const playerOrigin = Platform.OS === 'web' && typeof window !== 'undefined'
    ? window.location.origin
    : `https://${appId || 'com.austinmoviebox.austinemoviebox'}`;

  const isSmallDevice = windowWidth <= 360;
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        let keys: string[];
        try {
          keys = await (cachedKeys?.length ? Promise.resolve(cachedKeys) : fetchMovieTrailerKeys(movieId));
        } catch (error) {
          if (!isYouTubeVideoId(cachedKey)) throw error;
          keys = [cachedKey];
        }
        if (!active) return;
        const validKeys = [...new Set(keys.filter(isYouTubeVideoId))].slice(0, 3);
        if (!validKeys.length) {
          setError('No official trailer is available for this movie yet.');
          return;
        }
        setTrailerKeys(validKeys);
      } catch {
        if (active) setError('Could not load this trailer. Check your connection and try again.');
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [movieId, cachedKey, cachedKeys]);

  const html = useMemo(() => trailerKey
    ? createTrailerDocument(trailerKey, playerOrigin, autoplay, messageId)
    : '', [trailerKey, playerOrigin, autoplay, messageId]);

  const handlePlayerMessage = useCallback((message: unknown) => {
    if (!message || typeof message !== 'object') return;
    const event = message as { source?: string; id?: string; type?: string; value?: number };
    if (event.source !== 'austinmoviebox-player' || event.id !== messageId) return;
    if (event.type === 'error') {
      if ([100, 101, 150].includes(event.value ?? 0) && trailerIndex + 1 < trailerKeys.length) {
        setPlayback('Trying another trailer…');
        setTrailerIndex(trailerIndex + 1);
      } else setError(trailerPlaybackError(event.value ?? 0));
    }
    if (event.type === 'ready') setPlayback('Ready — tap play if needed');
    if (event.type === 'state') {
      setPlayback(event.value === 1 ? 'Playing trailer' : event.value === 2 ? 'Paused' : event.value === 0 ? 'Trailer ended' : 'Loading trailer…');
    }
  }, [messageId, trailerIndex, trailerKeys.length]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const listener = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow && event.origin === playerOrigin) {
        handlePlayerMessage(event.data);
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [playerOrigin, handlePlayerMessage]);

  const handleShare = async () => {
    try {
      await Share.share({
        title: movie.title,
        message: `Watching "${movie.title}" on AustinMovieBox! Rated ★ ${movie.rating.toFixed(1)}/10.`,
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
  const playerHeight = Math.max(200, Math.min(Math.round(maxPlayerWidth * (9 / 16)), windowHeight * 0.55));

  return (
    <Modal
      visible
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
              <Text style={styles.liveBadgeText}>OFFICIAL TRAILER</Text>
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
          {error ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="videocam-off-outline" size={30} color={colors.cinemaAmber} />
              <Text accessibilityRole="alert" style={[styles.loadingText, { textAlign: 'center', paddingHorizontal: 20 }]}>{error}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Retry trailer" onPress={onRetry} style={styles.dismissBtn}>
                <Text style={styles.dismissBtnText}>Try Again</Text>
              </Pressable>
            </View>
          ) : isLoading || !trailerKey ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.cinemaAmber} />
              <Text style={styles.loadingText}>Loading official trailer…</Text>
            </View>
          ) : Platform.OS === 'web' ? (
            <iframe
              key={messageId}
              ref={iframeRef}
              srcDoc={html}
              title={`${movie.title} Trailer`}
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: colors.cinemaCanvas }}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <WebView
              key={messageId}
              source={{ html, baseUrl: playerOrigin }}
              originWhitelist={['https://*']}
              style={styles.webView}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={!autoplay}
              javaScriptEnabled
              domStorageEnabled
              onMessage={(event) => {
                try { handlePlayerMessage(JSON.parse(event.nativeEvent.data)); } catch { /* Ignore unrelated messages. */ }
              }}
              onError={() => setError(trailerPlaybackError(0))}
              onHttpError={() => setError(trailerPlaybackError(0))}
            />
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

          {/* In-App Theatrical Streaming Quality Bar */}
          <View style={styles.theatricalStreamStatus}>
            <View style={styles.theatricalStreamLeft}>
              <View style={styles.liveStreamDot} />
              <Text style={styles.theatricalStreamText}>
                {error ? 'Trailer unavailable' : playback}
              </Text>
            </View>
            <View style={styles.theatricalStreamBadge}>
              <Text style={styles.theatricalStreamBadgeText}>YOUTUBE</Text>
            </View>
          </View>

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
            <Text style={styles.dismissBtnText}>Return to AustinMovieBox</Text>
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
  webView: {
    width: '100%',
    height: '100%',
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
  theatricalStreamStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.quietStage,
    borderWidth: 1,
    borderColor: 'rgba(215, 163, 91, 0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  theatricalStreamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  liveStreamDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.cinemaAmber,
  },
  theatricalStreamText: {
    color: colors.primaryInk,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  theatricalStreamBadge: {
    backgroundColor: 'rgba(215, 163, 91, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  theatricalStreamBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
