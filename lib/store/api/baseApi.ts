import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { setCredentials, logout } from '../features/authSlice';
import type {
  AuthState,
  ApiResponse,
  RefreshTokenResponseData,
} from '../types';
import { TAG_TYPES } from './tags';

// ─── Base Query ───────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// ─── Refresh Token Mutex ─────────────────────────────────────
// Prevents multiple parallel 401s from triggering concurrent refresh calls.

let refreshPromise: Promise<boolean> | null = null;

// ─── Base Query With Reauth ───────────────────────────────────

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If a refresh is already in progress, wait for it instead of firing another
    if (refreshPromise) {
      const refreshed = await refreshPromise;
      if (refreshed) {
        result = await baseQuery(args, api, extraOptions);
      }
      return result;
    }

    const refreshToken = (api.getState() as { auth: AuthState }).auth
      .refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    // Start refresh and store the promise so parallel requests can wait
    refreshPromise = (async () => {
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const response = refreshResult.data as ApiResponse<RefreshTokenResponseData>;
          const { token, user } = response.data;
          api.dispatch(setCredentials({ user, token }));
          return true;
        }

        api.dispatch(logout());
        return false;
      } catch {
        api.dispatch(logout());
        return false;
      }
    })();

    const refreshed = await refreshPromise;
    refreshPromise = null;

    if (refreshed) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// ─── API ──────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
