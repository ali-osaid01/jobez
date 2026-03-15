'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from './store';
import { hydrateAuth } from './features/authSlice';
import { useAppStore } from './hooks';
import type { AuthState } from './types';

// ─── LocalStorage Keys ───────────────────────────────────────

const AUTH_KEY = 'jobez_auth';
const USER_KEY = 'jobez_user';
const TOKEN_KEY = 'jobez_token';
const REFRESH_TOKEN_KEY = 'jobez_refresh_token';

// ─── Synchronous Hydration ──────────────────────────────────
// Reads localStorage and returns an AuthState to preload into the store,
// so auth is available on the very first render (no flash/redirect).

function getPersistedAuth(): AuthState | null {
  if (typeof window === 'undefined') return null;

  try {
    const authFlag = localStorage.getItem(AUTH_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (authFlag !== 'true' || !userStr || !token) return null;

    const storedUser = JSON.parse(userStr) as Record<string, unknown>;

    // Validate required fields exist
    if (
      typeof storedUser.id !== 'string' ||
      typeof storedUser.email !== 'string' ||
      typeof storedUser.role !== 'string'
    ) {
      return null;
    }

    const role = storedUser.role as string;
    if (role !== 'job-seeker' && role !== 'employer') return null;

    return {
      user: {
        id: storedUser.id,
        email: storedUser.email,
        phone: typeof storedUser.phone === 'string' ? storedUser.phone : '',
        role,
        name: typeof storedUser.name === 'string' ? storedUser.name : undefined,
        company: typeof storedUser.company === 'string' ? storedUser.company : undefined,
        onboardingComplete: storedUser.onboardingComplete === true,
      },
      token,
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      isAuthenticated: true,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[StoreProvider] Failed to hydrate auth from localStorage:', err);
    }
    return null;
  }
}

// ─── Auth Persister ──────────────────────────────────────────
// Syncs Redux auth state → localStorage on every change.

function AuthPersister({ children }: { children: React.ReactNode }) {
  const store = useAppStore();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { auth } = store.getState();

      if (auth.isAuthenticated && auth.user) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(USER_KEY, JSON.stringify(auth.user));

        if (auth.token) {
          localStorage.setItem(TOKEN_KEY, auth.token);
        }
        if (auth.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
        }
      } else {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    });

    return unsubscribe;
  }, [store]);

  return <>{children}</>;
}

// ─── Store Provider ───────────────────────────────────────────

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    const store = makeStore();

    // Hydrate auth synchronously before first render
    const persisted = getPersistedAuth();
    if (persisted) {
      store.dispatch(hydrateAuth(persisted));
    }

    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <AuthPersister>{children}</AuthPersister>
    </Provider>
  );
}
