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

// ─── Base Query With Reauth ───────────────────────────────────

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as { auth: AuthState }).auth
      .refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    // Attempt token refresh
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
      // Backend wraps response in { data: { token, user }, message }
      const response = refreshResult.data as ApiResponse<RefreshTokenResponseData>;
      const { token, user } = response.data;

      api.dispatch(setCredentials({ user, token }));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
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
