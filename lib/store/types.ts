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

// ─── Profile Types ───────────────────────────────────────────

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
}

export interface JobSeekerProfile {
  title: string;
  experience: string;
  skills: string[];
  location: string;
  expectedSalary: string;
  education: Education[];
  certifications: string[];
  workExperience: WorkExperience[];
  preferredRole: string;
  bio: string;
}

export interface EmployerProfile {
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  description: string;
}

// Backend returns/accepts flat profile fields (not nested)
export interface UpdateProfileRequest {
  onboardingComplete?: boolean;
  // Job Seeker fields
  title?: string | null;
  experience?: string | null;
  skills?: string[] | null;
  location?: string | null;
  expectedSalary?: string | null;
  education?: Education[] | null;
  certifications?: string[] | null;
  workExperience?: WorkExperience[] | null;
  preferredRole?: string | null;
  bio?: string | null;
  // Employer fields
  company?: string | null;
  companySize?: string | null;
  industry?: string | null;
  website?: string | null;
  description?: string | null;
}

export interface ProfileResponseData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  onboardingComplete: boolean;
  // Job Seeker fields
  title: string | null;
  location: string | null;
  experience: string | null;
  preferredRole: string | null;
  expectedSalary: string | null;
  skills: string[] | null;
  education: Education[] | null;
  workExperience: WorkExperience[] | null;
  certifications: string[] | null;
  resumeUrl: string | null;
  bio: string | null;
  // Employer fields
  company: string | null;
  companySize: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  founded: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeExtractResponseData {
  title: string;
  experience: string;
  skills: string[];
  location: string;
  education: Education[];
  certifications: string[];
  workExperience: WorkExperience[];
  bio: string;
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
