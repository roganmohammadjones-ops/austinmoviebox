import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Database } from '../types/database';

const defaultSupabaseUrl = 'https://bvbhiqwaeycnhoqfkrpj.supabase.co';
const defaultSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YmhpcXdhZXljbmhvcWZrcnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNDgyMDAsImV4cCI6MjEwNjkyNDIwMH0.yI2ORTDDXSyRUH8z8eMmeIJ4eg0s4fcC9bSW5ePXmy8';

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || defaultSupabaseUrl;
const rawAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || defaultSupabaseAnonKey;

export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
  rawAnonKey &&
  rawUrl.startsWith('https://') &&
  !rawUrl.includes('your-project') &&
  !rawUrl.includes('placeholder')
);

// Fallback values prevent createClient from throwing an error during startup if keys aren't configured yet
const clientUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const clientAnonKey = isSupabaseConfigured ? rawAnonKey : 'placeholder-anon-key';

// SSR-safe storage adapter: avoids "window is not defined" during Node.js static build prerendering
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isServer) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient<Database>(clientUrl, clientAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});

/**
 * Resilient timeout wrapper for async operations to prevent network hangs.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 8000,
  fallbackValue?: T
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
      } else {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return result;
  } catch (error) {
    clearTimeout(timer!);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw error;
  }
}
