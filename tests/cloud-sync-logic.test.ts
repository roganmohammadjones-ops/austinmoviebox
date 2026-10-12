import assert from 'node:assert/strict';
import test from 'node:test';
import type { Movie } from '../src/types/index.ts';

/**
 * Union deduplication pure logic helper
 */
function mergeFavorites(local: Movie[], cloud: Movie[]): { merged: Movie[]; localOnlyToUpload: Movie[] } {
  const mergedMap = new Map<string, Movie>();

  // Add all cloud items
  for (const m of cloud) {
    if (m?.id) {
      mergedMap.set(m.id, m);
    }
  }

  const localOnlyToUpload: Movie[] = [];

  // Union with local items
  for (const m of local) {
    if (m?.id) {
      if (!mergedMap.has(m.id)) {
        localOnlyToUpload.push(m);
        mergedMap.set(m.id, m);
      }
    }
  }

  return {
    merged: Array.from(mergedMap.values()),
    localOnlyToUpload,
  };
}

const mockMovieA: Movie = {
  id: 'film-1',
  title: 'Inception',
  overview: 'Dream within a dream',
  posterUrl: 'https://image.tmdb.org/t/p/w500/test1.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/w1280/back1.jpg',
  rating: 8.8,
  releaseYear: 2010,
  genres: ['Sci-Fi', 'Action'],
  durationMinutes: 148,
};

const mockMovieB: Movie = {
  id: 'film-2',
  title: 'Interstellar',
  overview: 'Mankind was born on Earth',
  posterUrl: 'https://image.tmdb.org/t/p/w500/test2.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/w1280/back2.jpg',
  rating: 8.7,
  releaseYear: 2014,
  genres: ['Sci-Fi', 'Drama'],
  durationMinutes: 169,
};

const mockMovieC: Movie = {
  id: 'film-3',
  title: 'Oppenheimer',
  overview: 'The story of J. Robert Oppenheimer',
  posterUrl: 'https://image.tmdb.org/t/p/w500/test3.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/w1280/back3.jpg',
  rating: 8.9,
  releaseYear: 2023,
  genres: ['Biography', 'Drama'],
  durationMinutes: 180,
};

test('Non-Destructive Cloud Sync - Union Merge (Local + Cloud)', () => {
  const local = [mockMovieA, mockMovieB];
  const cloud = [mockMovieB, mockMovieC];

  const result = mergeFavorites(local, cloud);

  // Expected union contains film-1, film-2, film-3
  assert.equal(result.merged.length, 3, 'Merged set must contain exactly 3 unique movies');

  const ids = result.merged.map((m) => m.id);
  assert.ok(ids.includes('film-1'), 'Must include local film-1');
  assert.ok(ids.includes('film-2'), 'Must include shared film-2');
  assert.ok(ids.includes('film-3'), 'Must include cloud film-3');

  // local-only to upload should be film-1
  assert.equal(result.localOnlyToUpload.length, 1);
  assert.equal(result.localOnlyToUpload[0].id, 'film-1');
});

test('Non-Destructive Cloud Sync - Empty Cloud State', () => {
  const local = [mockMovieA];
  const cloud: Movie[] = [];

  const result = mergeFavorites(local, cloud);

  assert.equal(result.merged.length, 1);
  assert.equal(result.localOnlyToUpload.length, 1);
  assert.equal(result.localOnlyToUpload[0].id, 'film-1');
});

test('Non-Destructive Cloud Sync - Empty Local State', () => {
  const local: Movie[] = [];
  const cloud = [mockMovieC];

  const result = mergeFavorites(local, cloud);

  assert.equal(result.merged.length, 1);
  assert.equal(result.localOnlyToUpload.length, 0, 'No local items to upload');
});

test('Non-Destructive Cloud Sync - Identical Sets (No Duplicates)', () => {
  const local = [mockMovieA, mockMovieB];
  const cloud = [mockMovieA, mockMovieB];

  const result = mergeFavorites(local, cloud);

  assert.equal(result.merged.length, 2);
  assert.equal(result.localOnlyToUpload.length, 0);
});
