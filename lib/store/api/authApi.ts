import { baseApi } from './baseApi';
import { setCredentials, logout } from '../features/authSlice';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ApiResponse,
} from '../types';

// ─── Auth API ─────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Unwrap { data: ..., message: ... } → just the inner data
      transformResponse: (response: ApiResponse<AuthResponseData>) =>
        response.data,
      invalidatesTags: ['User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken,
            }),
          );
        } catch {
          // Error handled by component via the mutation hook
        }
      },
    }),

    signup: builder.mutation<AuthResponseData, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: ApiResponse<AuthResponseData>) =>
        response.data,
      invalidatesTags: ['User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken,
            }),
          );
        } catch {
          // Error handled by component via the mutation hook
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponseData, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<RefreshTokenResponseData>) =>
        response.data,
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
