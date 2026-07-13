// ─── Store ────────────────────────────────────────────────────
export { makeStore } from "./store";
export type { AppStore, RootState, AppDispatch } from "./store";

// ─── Hooks ────────────────────────────────────────────────────
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";

// ─── Provider ─────────────────────────────────────────────────
export { default as StoreProvider } from "./provider";

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
} from "./features/authSlice";

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
} from "./features/uiSlice";

// ─── API ──────────────────────────────────────────────────────
export { baseApi } from "./api/baseApi";
export { TAG_TYPES } from "./api/tags";
export {
  authApi,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from "./api/authApi";
export {
  profileApi,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useExtractResumeMutation,
} from "./api/profileApi";
export {
  jobsApi,
  useGetJobsQuery,
  useGetRecommendedJobsQuery,
  useGetSavedJobsQuery,
  useGetJobByIdQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useLazyGetApplicationResumeQuery,
  useContactApplicantMutation,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useToggleBookmarkMutation,
  useApplyForJobMutation,
} from "./api/jobsApi";
export {
  interviewsApi,
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  useStartInterviewMutation,
  useSubmitInterviewResponsesMutation,
  useGetInterviewResultsQuery,
  useScheduleInterviewMutation,
  useUpdateInterviewMutation,
} from "./api/interviewsApi";
export { dashboardApi, useGetDashboardStatsQuery } from "./api/dashboardApi";

// ─── Types ────────────────────────────────────────────────────
export type {
  ApiResponse,
  ApiError,
  PaginatedListResponse,
  PaginationQueryParams,
  AuthUser,
  AuthState,
  LoginRequest,
  SignupRequest,
  AuthResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  Education,
  WorkExperience,
  JobSeekerProfile,
  EmployerProfile,
  UpdateProfileRequest,
  ProfileResponseData,
  ResumeExtractResponseData,
  JobLocationType,
  JobType,
  JobExperienceLevel,
  JobStatus,
  ApplicationStatus,
  JobResponseData,
  ApplicationCounts,
  CreateJobRequest,
  UpdateJobRequest,
  UpdateApplicationStatusRequest,
  JobsListResponse,
  JobsQueryParams,
  InterviewCounts,
  BookmarkResponse,
  ApplicationResponseData,
  ApplicationApplyResponseData,
  ApplicationsListResponse,
  ApplicationsQueryParams,
  ApplicationStatusUpdateRequest,
  InterviewResponseData,
  InterviewsListResponse,
  InterviewsQueryParams,
  InterviewStatus,
  InterviewType,
  InterviewQuestion,
  InterviewResultsData,
  ScheduleInterviewRequest,
  UpdateInterviewRequest,
  JobSeekerDashboardStats,
  EmployerDashboardStats,
  DashboardStats,
  ModalState,
  ThemeMode,
  UiState,
  ApiTagType,
} from "./types";
