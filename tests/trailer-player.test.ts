import assert from 'node:assert/strict';
import test from 'node:test';
import { createTrailerDocument, isYouTubeVideoId, selectTrailerKeys, trailerPlaybackError } from '../src/services/trailer-player.ts';

test('trailer alternatives prioritize official trailers and exclude clips, invalid IDs and duplicates', () => {
  assert.deepEqual(selectTrailerKeys([
    { site: 'YouTube', key: 'teaser00001', type: 'Teaser', official: true },
    { site: 'YouTube', key: 'trailer0001', type: 'Trailer', official: false },
    { site: 'YouTube', key: 'official001', type: 'Trailer', official: true },
    { site: 'YouTube', key: 'official001', type: 'Trailer', official: true },
    { site: 'YouTube', key: 'clip0000001', type: 'Clip', official: true },
    { site: 'Vimeo', key: 'vimeo000001', type: 'Trailer' },
    { site: 'YouTube', key: 'invalid', type: 'Trailer' },
  ]), ['official001', 'trailer0001', 'teaser00001']);
});

test('the player requires an actual video and never embeds a search results page', () => {
  assert.equal(isYouTubeVideoId('dQw4w9WgXcQ'), true);
  assert.equal(isYouTubeVideoId('https://youtube.com/watch?v=abc'), false);
  assert.throws(() => createTrailerDocument('</script>', 'https://example.com', true, 'player'), /Invalid/);
});

test('web and native documents identify the player and report real playback errors', () => {
  for (const origin of ['https://example.expo.app', 'https://com.austinmoviebox.austinemoviebox']) {
    const html = createTrailerDocument('dQw4w9WgXcQ', origin, false, 'player');
    assert.ok(html.includes(`origin: "${origin}"`));
    assert.ok(html.includes('autoplay: 0'));
    assert.ok(html.includes('strict-origin-when-cross-origin'));
    assert.ok(html.includes('onError:'));
    assert.ok(html.includes('window.ReactNativeWebView.postMessage'));
    assert.ok(!html.includes('listType=search'));
  }
  assert.match(trailerPlaybackError(150), /owner has disabled/);
  assert.match(trailerPlaybackError(100), /no longer available/);
});
