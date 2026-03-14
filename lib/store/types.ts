import type { UserRole } from '@/lib/auth';

// ─── API Response Wrappers ───────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, string> | null;
  };
}

// ─── Auth Types ───────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  name?: string;
  company?: string;
  onboardingComplete: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// ─── Auth API Request Types ──────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  name: string;
}

// ─── Auth API Response Data (the inner `data` field) ─────────

export interface AuthResponseData {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  token: string;
  user: AuthUser;
}

// ─── UI Types ─────────────────────────────────────────────────

export interface ModalState {
  id: string;
  props?: Record<string, unknown>;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: ModalState | null;
  theme: ThemeMode;
}

// ─── API Tag Types (re-export from api/tags.ts) ──────────────

export type { ApiTagType } from './api/tags';
export { TAG_TYPES as API_TAG_TYPES } from './api/tags';
