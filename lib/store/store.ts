import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi';
import authReducer from './features/authSlice';
import uiReducer from './features/uiSlice';

// ─── Store Factory ────────────────────────────────────────────
// Next.js App Router requires a factory — no singletons.
// Each SSR request gets its own store instance.

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

// ─── Types ────────────────────────────────────────────────────

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
