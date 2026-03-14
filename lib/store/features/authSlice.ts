import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, AuthUser } from '../types';

// ─── Initial State ────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

// ─── Slice ────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        refreshToken?: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
    },

    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },

    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    hydrateAuth(_state, action: PayloadAction<AuthState>) {
      return action.payload;
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────

export const { setCredentials, updateToken, updateUser, logout, hydrateAuth } =
  authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role ?? null;

export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;

// ─── Reducer ──────────────────────────────────────────────────

export default authSlice.reducer;
