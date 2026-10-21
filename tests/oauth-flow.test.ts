import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { createOAuthCallbackHandler, parseOAuthCallback, webAuthRedirectUrl } from '../src/services/oauth-flow.ts';

test('Google returns to the active Expo web origin or GitHub Pages base path', () => {
  assert.equal(webAuthRedirectUrl('http://localhost:8081'), 'http://localhost:8081/auth-callback');
  assert.equal(webAuthRedirectUrl('https://moviebox.expo.app'), 'https://moviebox.expo.app/auth-callback');
  assert.equal(webAuthRedirectUrl('https://example.github.io', '/austinmoviebox/'), 'https://example.github.io/austinmoviebox/auth-callback');
});

test('web exports preserve native config and apply a base path only when configured', () => {
  const configForBuild = createRequire(import.meta.url)('../app.config.js');
  const previous = process.env.EXPO_PUBLIC_WEB_BASE_PATH;
  try {
    delete process.env.EXPO_PUBLIC_WEB_BASE_PATH;
    const config = { scheme: ['austinmoviebox'], experiments: { typedRoutes: true } };
    assert.deepEqual(configForBuild({ config }).experiments, { typedRoutes: true, baseUrl: '' });
    process.env.EXPO_PUBLIC_WEB_BASE_PATH = '/austinmoviebox/';
    const pages = configForBuild({ config });
    assert.equal(pages.experiments.baseUrl, '/austinmoviebox');
    assert.deepEqual(pages.scheme, config.scheme);
    process.env.EXPO_PUBLIC_WEB_BASE_PATH = 'https://other.example';
    assert.throws(() => configForBuild({ config }), /must be a URL path/);
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_WEB_BASE_PATH;
    else process.env.EXPO_PUBLIC_WEB_BASE_PATH = previous;
  }
});

test('native and web callbacks read PKCE codes and legacy token fragments', () => {
  assert.deepEqual(parseOAuthCallback('austinmoviebox://auth-callback?code=one'), { kind: 'code', code: 'one' });
  assert.deepEqual(parseOAuthCallback('https://example.com/auth-callback#access_token=access&refresh_token=refresh'), {
    kind: 'tokens', accessToken: 'access', refreshToken: 'refresh',
  });
  assert.throws(() => parseOAuthCallback('austinmoviebox://auth-callback#access_token=access'), /incomplete/);
  assert.throws(() => parseOAuthCallback('https://example.com/auth-callback'), /No authorization/);
  assert.throws(() => parseOAuthCallback('austinmoviebox://auth-callback?code=one#error=access_denied&error_description=User+cancelled'), /User cancelled/);
});

test('browser result and callback route exchange the same code only once', async () => {
  let exchanges = 0;
  const session = { user: { id: 'test-user' } };
  const handler = createOAuthCallbackHandler({
    exchangeCodeForSession: async () => { exchanges++; return { data: { session }, error: null }; },
    setSession: async () => ({ data: { session }, error: null }),
  });
  const [first, second] = await Promise.all([
    handler.complete('austinmoviebox://auth-callback?code=one'),
    handler.complete('austinmoviebox://auth-callback#code=one'),
  ]);
  assert.equal(first, session);
  assert.equal(second, session);
  assert.equal(exchanges, 1);
  await handler.complete('austinmoviebox://auth-callback?code=one');
  assert.equal(exchanges, 1);
  handler.reset();
  await handler.complete('austinmoviebox://auth-callback?code=two');
  assert.equal(exchanges, 2);
});

test('failed exchanges never silently reuse a previous signed-in account', async () => {
  const handler = createOAuthCallbackHandler({
    exchangeCodeForSession: async () => ({ data: { session: null }, error: { message: 'Expired code' } }),
    setSession: async () => ({ data: { session: null }, error: { message: 'Invalid token' } }),
  });
  await assert.rejects(handler.complete('austinmoviebox://auth-callback?code=expired'), /Expired code/);
  await assert.rejects(handler.complete('austinmoviebox://auth-callback#access_token=a&refresh_token=b'), /Invalid token/);
});
