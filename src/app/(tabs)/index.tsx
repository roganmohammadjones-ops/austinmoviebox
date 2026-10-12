import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeSkeleton } from '../../components/home-skeleton';
import { MovieHero } from '../../components/movie-hero';
import { MovieRail } from '../../components/movie-rail';
import {
  fetchMovieDetails,
  fetchNewReleasesMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
} from '../../services/movie-api';
import { useAuthStore } from '../../stores/auth-store';
import { colors } from '../../theme/tokens';
import { Movie } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const isGuest = useAuthStore((state) => state.isGuest);
  const { width: windowWidth } = useWindowDimensions();

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [newReleasesMovies, setNewReleasesMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSmall = windowWidth <= 360;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const horizontalPadding = useMemo(() => {
    if (isDesktop) return 32;
    if (isTablet) return 24;
    if (isSmall) return 16;
    return 20;
  }, [isDesktop, isTablet, isSmall]);

  const loadMovies = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [trending, popular, topRated, newReleases] = await Promise.all([
        fetchTrendingMovies(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchNewReleasesMovies(),
      ]);

      setTrendingMovies(trending);
      setPopularMovies(popular);
      setTopRatedMovies(topRated);
      setNewReleasesMovies(newReleases);

      if (
        trending.length === 0 &&
        popular.length === 0 &&
        topRated.length === 0 &&
        newReleases.length === 0
      ) {
        setError('No movies returned from TMDB API. Please verify your connection.');
      }
    } catch (err: any) {
      console.error('[HomeScreen] Error loading movies from TMDB:', err);
      setError(err?.message || 'Failed to load movies from TMDB.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [trending, popular, topRated, newReleases] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchNewReleasesMovies(),
        ]);

        if (!isMounted) return;
        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setNewReleasesMovies(newReleases);

        if (
          trending.length === 0 &&
          popular.length === 0 &&
          topRated.length === 0 &&
          newReleases.length === 0
        ) {
          setError('No movies returned from TMDB API. Please verify your connection.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('[HomeScreen] Error loading movies from TMDB:', err);
        setError(err?.message || 'Failed to load movies from TMDB.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const spotlightMovie = useMemo(() => {
    return trendingMovies[0] || popularMovies[0] || null;
  }, [trendingMovies, popularMovies]);

  const [enrichedSpotlight, setEnrichedSpotlight] = useState<Movie | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (spotlightMovie?.id) {
      fetchMovieDetails(spotlightMovie.id).then((full) => {
        if (isMounted && full) {
          setEnrichedSpotlight(full);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [spotlightMovie?.id]);

  const activeSpotlight =
    enrichedSpotlight && enrichedSpotlight.id === spotlightMovie?.id
      ? enrichedSpotlight
      : spotlightMovie;

  const handleProfilePress = () => {
    if (isGuest) {
      router.push('/auth' as any);
    } else {
      router.push('/(tabs)/profile' as any);
    }
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/search' as any);
  };

  const handleSeeAll = () => {
    router.push('/(tabs)/search' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Top Editorial Brand Header */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.headerLeft}>
            <View style={styles.brandBadge}>
              <Ionicons name="film-outline" size={13} color={colors.cinemaAmber} />
              <Text style={styles.brandBadgeText}>AUSTIN MOVIEBOX</Text>
            </View>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.headerTitle,
                  isDesktop && { fontSize: 30 },
                  isSmall && { fontSize: 22 },
                ]}
              >
                Discover
              </Text>
              <Text style={[styles.issueSubtitle, isSmall && { fontSize: 9 }]}>
                CURATED THEATRICAL ARCHIVE
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Quick Search Shortcut */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search catalog"
              onPress={handleSearchPress}
              style={({ pressed }) => [
                styles.iconButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Ionicons name="search-outline" size={20} color={colors.secondaryInk} />
            </Pressable>

            {/* Profile Avatar / Guest Action */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isGuest ? 'Sign in' : 'View Profile'}
              onPress={handleProfilePress}
              style={({ pressed }) => [
                styles.avatarButton,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Ionicons
                name={isGuest ? 'person-outline' : 'person'}
                size={18}
                color={colors.cinemaCanvas}
              />
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <HomeSkeleton />
          </ScrollView>
        ) : error && !spotlightMovie ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={44} color={colors.cinemaAmber} />
            <Text style={styles.errorTitle}>Vault Connection Error</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => loadMovies(false)}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadMovies(true)}
                tintColor={colors.cinemaAmber}
                colors={[colors.cinemaAmber]}
              />
            }
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: isDesktop ? 60 : 96 },
            ]}
          >
            {/* Featured Hero Billboard */}
            {activeSpotlight ? (
              <View
                style={[
                  styles.heroPadding,
                  {
                    paddingHorizontal: horizontalPadding,
                    paddingTop: isSmall ? 12 : 16,
                  },
                ]}
              >
                <MovieHero movie={activeSpotlight} />
              </View>
            ) : null}

            {/* Canonical Horizontal Rails from Live TMDB */}
            <MovieRail
              title="Trending Now"
              movies={trendingMovies || []}
              onSeeAllPress={handleSeeAll}
            />

            <MovieRail
              title="Popular Movies"
              movies={popularMovies || []}
              onSeeAllPress={handleSeeAll}
            />

            <MovieRail
              title="Top Rated"
              movies={topRatedMovies || []}
              onSeeAllPress={handleSeeAll}
            />

            <MovieRail
              title="New Releases"
              movies={newReleasesMovies || []}
              onSeeAllPress={handleSeeAll}
            />
          </ScrollView>
        )}
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
    maxWidth: 1200,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  errorTitle: {
    color: colors.primaryInk,
    fontSize: 20,
    fontWeight: '700',
  },
  errorSubtitle: {
    color: colors.secondaryInk,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 360,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: colors.cinemaAmber,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.cinemaCanvas,
    fontWeight: '700',
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.3)',
  },
  headerLeft: {
    flex: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  brandBadgeText: {
    color: colors.cinemaAmber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  headerTitle: {
    color: colors.primaryInk,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  issueSubtitle: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    fontFamily: 'Courier',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.5)',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cinemaAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPadding: {},
});
