'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from './store';
import { hydrateAuth } from './features/authSlice';
import { useAppDispatch, useAppStore } from './hooks';
import type { AuthState } from './types';

// ─── LocalStorage Keys ───────────────────────────────────────

const AUTH_KEY = 'jobez_auth';
const USER_KEY = 'jobez_user';
const TOKEN_KEY = 'jobez_token';
const REFRESH_TOKEN_KEY = 'jobez_refresh_token';

// ─── Auth Initializer ─────────────────────────────────────────
// On mount: hydrates Redux from localStorage.
// On state change: persists Redux auth state back to localStorage.

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const initialized = useRef(false);

  // Hydrate Redux from localStorage on first mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const authFlag = localStorage.getItem(AUTH_KEY);
      const userStr = localStorage.getItem(USER_KEY);

      if (authFlag !== 'true' || !userStr) return;

      const storedUser = JSON.parse(userStr) as Record<string, unknown>;

      const authState: AuthState = {
        user: {
          id: storedUser.id as string,
          email: storedUser.email as string,
          phone: (storedUser.phone as string) ?? '',
          role: storedUser.role as 'job-seeker' | 'employer',
          name: storedUser.name as string | undefined,
          company: storedUser.company as string | undefined,
          onboardingComplete:
            (storedUser.onboardingComplete as boolean) ?? false,
        },
        token: localStorage.getItem(TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
        isAuthenticated: true,
      };

      dispatch(hydrateAuth(authState));
    } catch {
      // Invalid stored data — stay logged out
    }
  }, [dispatch]);

  // Sync Redux auth state → localStorage on every change
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
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
