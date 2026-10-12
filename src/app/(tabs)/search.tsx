import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/empty-state';
import { MovieCard } from '../../components/movie-card';
import { GENRES, MOVIES } from '../../data/movies';
import { colors } from '../../theme/tokens';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      const matchesGenre =
        selectedGenre === 'All' ||
        movie.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        movie.title.toLowerCase().includes(q) ||
        movie.overview.toLowerCase().includes(q) ||
        (movie.director && movie.director.toLowerCase().includes(q)) ||
        movie.genres.some((g) => g.toLowerCase().includes(q));

      return matchesGenre && matchesQuery;
    });
  }, [query, selectedGenre]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerWrapper}>
        {/* Top Header Block */}
      <View style={styles.headerBlock}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.headlineText}>Search</Text>
            <Text style={styles.subheadText}>Explore the curated theatrical vault</Text>
          </View>

          <View style={styles.liveIndexBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveIndexText}>Live Index</Text>
          </View>
        </View>

        {/* 52px Search Input Bar */}
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={20} color={colors.mutedInk} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by title, director, or genre..."
            placeholderTextColor={colors.mutedInk}
            style={styles.searchInput}
            selectionColor={colors.cinemaAmber}
            autoCorrect={false}
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

        {/* Genre Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genrePillsRow}
        >
          {GENRES.map((genre: string) => {
            const isSelected = selectedGenre === genre;
            return (
              <Pressable
                key={genre}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedGenre(genre)}
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
                  {genre}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Results Metadata Bar */}
        <View style={styles.resultsMetaBar}>
          <Text style={styles.resultsCountText}>
            {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'} found
          </Text>
          <View style={styles.sortIndicator}>
            <Ionicons name="options-outline" size={14} color={colors.mutedInk} />
            <Text style={styles.sortText}>Relevance</Text>
          </View>
        </View>
      </View>

      {/* 2-Column Movie Grid or Empty State */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MovieCard movie={item} variant="grid" />}
        ListEmptyComponent={
          <EmptyState
            iconName="search-outline"
            title="No Titles Found"
            description="We couldn’t find any films matching your search terms. Try adjusting your query or genre filter."
            actionLabel="Clear Filters"
            onActionPress={() => {
              setQuery('');
              setSelectedGenre('All');
            }}
          />
        }
      />
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
});
