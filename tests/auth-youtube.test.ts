import assert from 'node:assert/strict';
import test from 'node:test';

interface MockUser {
  id: string;
  email?: string;
  app_metadata?: { provider?: string };
  user_metadata?: {
    name?: string;
    provider?: string;
    youtube_connected?: boolean;
    youtube_email?: string;
  };
}

function checkYouTubeConnected(user: MockUser | null, isGuest: boolean): boolean {
  if (isGuest || !user) return false;
  if (user.user_metadata?.youtube_connected) return true;
  if (user.app_metadata?.provider === 'youtube' || user.app_metadata?.provider === 'google') return true;
  if (user.user_metadata?.provider === 'youtube' || user.user_metadata?.provider === 'google') return true;
  if (user.email && (user.email.toLowerCase().endsWith('@gmail.com') || user.email.toLowerCase().endsWith('@googlemail.com'))) {
    return true;
  }
  return false;
}

test('Auth YouTube & Google - Guest Mode Denial', () => {
  const isConnected = checkYouTubeConnected(null, true);
  assert.equal(isConnected, false, 'Guest user must not be marked as YouTube verified by default');
});

test('Auth YouTube & Google - YouTube Provider Entitlement', () => {
  const user: MockUser = {
    id: 'usr_youtube_1',
    email: 'cinephile@custom-domain.org',
    app_metadata: { provider: 'youtube' },
    user_metadata: { youtube_connected: true },
  };
  const isConnected = checkYouTubeConnected(user, false);
  assert.equal(isConnected, true, 'YouTube authenticated user must have active stream privileges');
});

test('Auth YouTube & Google - Google / Gmail Auto Recognition', () => {
  const gmailUser: MockUser = {
    id: 'usr_gmail_1',
    email: 'austin.curator@gmail.com',
    app_metadata: {},
    user_metadata: {},
  };
  assert.equal(
    checkYouTubeConnected(gmailUser, false),
    true,
    '@gmail.com accounts should automatically qualify for YouTube streaming'
  );

  const googlemailUser: MockUser = {
    id: 'usr_googlemail_1',
    email: 'uk.collector@googlemail.com',
    app_metadata: {},
    user_metadata: {},
  };
  assert.equal(
    checkYouTubeConnected(googlemailUser, false),
    true,
    '@googlemail.com accounts should automatically qualify for YouTube streaming'
  );

  const genericEmailUser: MockUser = {
    id: 'usr_generic_1',
    email: 'curator@custom-domain.io',
    app_metadata: {},
    user_metadata: {},
  };
  assert.equal(
    checkYouTubeConnected(genericEmailUser, false),
    false,
    'Non-Google email without link must remain unverified until connected'
  );
});

test('Auth YouTube & Google - Account Linking State Transition', () => {
  let user: MockUser = {
    id: 'usr_standalone_1',
    email: 'filmmaker@cinema.art',
    app_metadata: {},
    user_metadata: {},
  };
  assert.equal(checkYouTubeConnected(user, false), false);

  // Link YouTube to existing user
  user = {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      youtube_connected: true,
      youtube_email: 'filmmaker@gmail.com',
    },
  };
  assert.equal(checkYouTubeConnected(user, false), true);
  assert.equal(user.user_metadata.youtube_email, 'filmmaker@gmail.com');
});
