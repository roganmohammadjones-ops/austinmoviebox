import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../../components/movie-card';
import { SearchEmptyVault } from '../../components/search-empty-vault';
import {
  TMDB_GENRES_LIST,
  fetchMoviesByGenre,
  fetchPopularMovies,
  searchMovies,
} from '../../services/movie-api';
import { colors } from '../../theme/tokens';
import { Movie } from '../../types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performFetch = useCallback(
    async (searchQuery: string, genreId: number) => {
      setIsLoading(true);
      try {
        const trimmed = searchQuery.trim();
        if (trimmed) {
          const results = await searchMovies(trimmed, genreId > 0 ? genreId : undefined);
          setMovies(results);
        } else if (genreId > 0) {
          const results = await fetchMoviesByGenre(genreId);
          setMovies(results);
        } else {
          const results = await fetchPopularMovies();
          setMovies(results);
        }
      } catch (err) {
        console.error('[SearchScreen] TMDB fetch error:', err);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger search with debounce for text input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    debounceTimerRef.current = setTimeout(
      () => {
        performFetch(trimmed, selectedGenreId);
      },
      trimmed ? 350 : 0
    );

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, selectedGenreId, performFetch]);

  const handleClear = () => {
    setQuery('');
  };

  const handleClearAll = () => {
    setQuery('');
    setSelectedGenreId(0);
  };

  const handleSelectShelf = (shelfQuery: string) => {
    setSelectedGenreId(0);
    setQuery(shelfQuery);
  };

  const handleGenrePress = (id: number) => {
    setSelectedGenreId(id);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Top Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.headlineText}>Search</Text>
              <Text style={styles.subheadText}>Explore the live TMDB theatrical vault</Text>
            </View>

            <View style={styles.liveIndexBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveIndexText}>TMDB Live</Text>
            </View>
          </View>

          {/* 52px Search Input Bar */}
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={20} color={colors.mutedInk} style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by movie title..."
              placeholderTextColor={colors.mutedInk}
              style={styles.searchInput}
              selectionColor={colors.cinemaAmber}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search input"
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color={colors.mutedInk} />
              </Pressable>
            )}
          </View>

          {/* Genre Filter Pills from TMDB */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genrePillsRow}
          >
            {TMDB_GENRES_LIST.map((item) => {
              const isSelected = selectedGenreId === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleGenrePress(item.id)}
                  style={({ pressed }) => [
                    styles.genrePill,
                    isSelected ? styles.genrePillActive : styles.genrePillInactive,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.genrePillText,
                      isSelected ? styles.genrePillTextActive : styles.genrePillTextInactive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Results Metadata Bar */}
          <View style={styles.resultsMetaBar}>
            <Text style={styles.resultsCountText}>
              {isLoading
                ? 'Searching TMDB...'
                : `${movies.length} ${movies.length === 1 ? 'title' : 'titles'} found`}
            </Text>
            <View style={styles.sortIndicator}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.cinemaAmber} />
              ) : (
                <>
                  <Ionicons name="options-outline" size={14} color={colors.mutedInk} />
                  <Text style={styles.sortText}>Live TMDB</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* 2-Column Movie Grid or Empty State */}
        {isLoading && movies.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.cinemaAmber} />
            <Text style={styles.loadingText}>Searching Theatrical Vault...</Text>
          </View>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <MovieCard movie={item} variant="grid" />}
            ListEmptyComponent={
              <SearchEmptyVault
                query={query}
                onClearFilters={handleClearAll}
                onSelectShelf={handleSelectShelf}
              />
            }
          />
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
    maxWidth: 768,
    alignSelf: 'center',
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(53, 56, 60, 0.3)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headlineText: {
    color: colors.primaryInk,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subheadText: {
    color: colors.secondaryInk,
    fontSize: 12,
    marginTop: 2,
  },
  liveIndexBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.quietStage,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinemaAmber,
  },
  liveIndexText: {
    color: colors.cinemaAmber,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.quietStage,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 56, 60, 0.4)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.primaryInk,
    fontSize: 14,
  },
  clearButton: {
    padding: 6,
  },
  genrePillsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  genrePill: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genrePillActive: {
    backgroundColor: colors.cinemaAmber,
  },
  genrePillInactive: {
    backgroundColor: colors.quietStage,
  },
  genrePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  genrePillTextActive: {
    color: colors.cinemaCanvas,
  },
  genrePillTextInactive: {
    color: colors.secondaryInk,
  },
  resultsMetaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  resultsCountText: {
    color: colors.secondaryInk,
    fontSize: 11,
    letterSpacing: 0.5,
    fontFamily: 'Courier',
  },
  sortIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: colors.mutedInk,
    fontSize: 11,
  },
  columnWrapper: {
    gap: 12,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
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
});
