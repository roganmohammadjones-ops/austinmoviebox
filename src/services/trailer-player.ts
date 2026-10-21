export function isYouTubeVideoId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(value);
}

export function selectTrailerKeys(videos: unknown): string[] {
  if (!Array.isArray(videos)) return [];
  const trailers = videos.filter((video) => video?.site === 'YouTube' &&
    isYouTubeVideoId(video.key) && (video.type === 'Trailer' || video.type === 'Teaser'));
  const priority = (video: { type: string; official?: boolean }) =>
    (video.type === 'Trailer' ? 0 : 2) + (video.official ? 0 : 1);
  trailers.sort((a, b) => priority(a) - priority(b));
  return [...new Set<string>(trailers.map((video) => video.key))];
}

export function trailerPlaybackError(code: number): string {
  if (code === 100) return 'This trailer is no longer available.';
  if (code === 101 || code === 150) return 'The video owner has disabled playback inside other apps.';
  if (code === 153) return 'YouTube could not identify this player. Please try again.';
  return 'This trailer could not be played. Check your connection and try again.';
}

/** Same YouTube player document for the browser iframe and the native WebView. */
export function createTrailerDocument(videoId: string, origin: string, autoplay: boolean, messageId: string): string {
  if (!isYouTubeVideoId(videoId)) throw new Error('Invalid YouTube video identifier');
  const safeOrigin = new URL(origin).origin;
  // JSON is embedded in a script tag: escape markup even for caller-provided origins.
  const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<style>html,body,#player{margin:0;width:100%;height:100%;background:#08090D;overflow:hidden}</style></head>
<body><div id="player"></div><script>
function send(type, value) {
  var message = { source: 'austinmoviebox-player', id: ${json(messageId)}, type: type, value: value };
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(message));
  else window.parent.postMessage(message, ${json(safeOrigin)});
}
var timer = setTimeout(function(){ send('error', 0); }, 20000);
window.onYouTubeIframeAPIReady = function() {
  new YT.Player('player', {
    width: '100%', height: '100%', videoId: ${json(videoId)},
    host: 'https://www.youtube-nocookie.com',
    playerVars: { autoplay: ${autoplay ? 1 : 0}, playsinline: 1, controls: 1, rel: 0, origin: ${json(safeOrigin)} },
    events: {
      onReady: function(){ clearTimeout(timer); send('ready'); },
      onStateChange: function(event){ send('state', event.data); },
      onAutoplayBlocked: function(){ clearTimeout(timer); send('ready'); },
      onError: function(event){ clearTimeout(timer); send('error', event.data); }
    }
  });
};
</script><script src="https://www.youtube.com/iframe_api" onerror="clearTimeout(timer);send('error',0)"></script></body></html>`;
}
