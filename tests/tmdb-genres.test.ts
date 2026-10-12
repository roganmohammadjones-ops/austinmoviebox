import assert from 'node:assert/strict';
import test from 'node:test';

const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

test('TMDB Genres - Key ID Mapping & Coverage', () => {
  assert.equal(TMDB_GENRES[28], 'Action');
  assert.equal(TMDB_GENRES[878], 'Sci-Fi');
  assert.equal(TMDB_GENRES[18], 'Drama');
  assert.equal(TMDB_GENRES[16], 'Animation');
  assert.equal(TMDB_GENRES[53], 'Thriller');
  assert.equal(TMDB_GENRES[35], 'Comedy');
  assert.equal(TMDB_GENRES[27], 'Horror');
});

test('TMDB Query Builder - URL & Parameter Construction', () => {
  function buildUrl(baseUrl: string, endpoint: string, params: Record<string, string | number>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${baseUrl}${cleanEndpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  const result = buildUrl('https://api.themoviedb.org/3', '/search/movie', {
    query: 'Oppenheimer',
    page: 1,
  });

  assert.equal(
    result,
    'https://api.themoviedb.org/3/search/movie?query=Oppenheimer&page=1'
  );
});
