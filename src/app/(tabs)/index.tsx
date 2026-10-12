import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieHero } from '../../components/movie-hero';
import { MovieRail } from '../../components/movie-rail';
import {
  getNewReleasesMovies,
  getPopularMovies,
  getSpotlightMovie,
  getTopRatedMovies,
  getTrendingMovies,
} from '../../data/movies';
import { useAuthStore } from '../../stores/auth-store';
import { colors } from '../../theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const isGuest = useAuthStore((state) => state.isGuest);
  const { width: windowWidth } = useWindowDimensions();

  const isSmall = windowWidth <= 360;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const horizontalPadding = useMemo(() => {
    if (isDesktop) return 32;
    if (isTablet) return 24;
    if (isSmall) return 16;
    return 20;
  }, [isDesktop, isTablet, isSmall]);

  const spotlightMovie = getSpotlightMovie();
  const trendingMovies = getTrendingMovies();
  const popularMovies = getPopularMovies();
  const topRatedMovies = getTopRatedMovies();
  const newReleasesMovies = getNewReleasesMovies();

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

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: isDesktop ? 60 : 96 },
          ]}
        >
          {/* Featured Hero Billboard */}
          {spotlightMovie ? (
            <View
              style={[
                styles.heroPadding,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: isSmall ? 12 : 16,
                },
              ]}
            >
              <MovieHero movie={spotlightMovie} />
            </View>
          ) : null}

          {/* Canonical Horizontal Rails (DESIGN.md §30) */}
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
