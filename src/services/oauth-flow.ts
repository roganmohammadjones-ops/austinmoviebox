/** Shared by web redirects and the native browser's deep-link result. */
export function webAuthRedirectUrl(origin: string, basePath = ''): string {
  const path = basePath.replace(/^\/+|\/+$/g, '');
  return new URL(`${path ? `/${path}` : ''}/auth-callback`, origin).toString();
}

export function parseOAuthCallback(url: string) {
  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.search);
  new URLSearchParams(parsed.hash.replace(/^#/, '')).forEach((value, key) => {
    params.set(key, value);
  });

  const error = params.get('error_description') || params.get('error');
  if (error) throw new Error(error);

  const code = params.get('code');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (accessToken || refreshToken) {
    if (!accessToken || !refreshToken) {
      throw new Error('Google returned an incomplete session. Please sign in again.');
    }
    return { kind: 'tokens' as const, accessToken, refreshToken };
  }
  if (code) return { kind: 'code' as const, code };
  throw new Error('No authorization was returned. Please sign in with Google again.');
}

interface AuthResponse<T> {
  data: { session: T | null };
  error: { message: string } | null;
}

interface CallbackAuthClient<T> {
  exchangeCodeForSession: (code: string) => Promise<AuthResponse<T>>;
  setSession: (tokens: { access_token: string; refresh_token: string }) => Promise<AuthResponse<T>>;
}

/** A native deep link can reach both the browser promise and the callback route. */
export function createOAuthCallbackHandler<T>(auth: CallbackAuthClient<T>) {
  let lastKey: string | null = null;
  let lastResult: Promise<T> | null = null;

  const complete = (url: string): Promise<T> => {
    const callback = parseOAuthCallback(url);
    const key = JSON.stringify(callback);
    if (key === lastKey && lastResult) return lastResult;

    lastKey = key;
    lastResult = (async () => {
      const response = callback.kind === 'code'
        ? await auth.exchangeCodeForSession(callback.code)
        : await auth.setSession({
            access_token: callback.accessToken,
            refresh_token: callback.refreshToken,
          });
      if (response.error) throw new Error(response.error.message);
      if (!response.data.session) throw new Error('Google sign-in did not create a session. Please try again.');
      return response.data.session;
    })();
    return lastResult;
  };

  return {
    complete,
    reset: () => {
      lastKey = null;
      lastResult = null;
    },
  };
}
