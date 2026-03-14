// ─── Store ────────────────────────────────────────────────────
export { makeStore } from './store';
export type { AppStore, RootState, AppDispatch } from './store';

// ─── Hooks ────────────────────────────────────────────────────
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';

// ─── Provider ─────────────────────────────────────────────────
export { default as StoreProvider } from './provider';

// ─── Auth Slice ───────────────────────────────────────────────
export {
  setCredentials,
  updateToken,
  updateUser,
  logout,
  hydrateAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
  selectToken,
  selectRefreshToken,
} from './features/authSlice';

// ─── UI Slice ─────────────────────────────────────────────────
export {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  openModal,
  closeModal,
  setTheme,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectActiveModal,
  selectTheme,
} from './features/uiSlice';

// ─── API ──────────────────────────────────────────────────────
export { baseApi } from './api/baseApi';
export { TAG_TYPES } from './api/tags';
export {
  authApi,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from './api/authApi';

// ─── Types ────────────────────────────────────────────────────
export type {
  ApiResponse,
  ApiError,
  AuthUser,
  AuthState,
  LoginRequest,
  SignupRequest,
  AuthResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ModalState,
  ThemeMode,
  UiState,
  ApiTagType,
} from './types';
