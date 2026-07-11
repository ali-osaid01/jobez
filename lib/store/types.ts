import type { UserRole } from "@/lib/auth";

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

export interface PaginatedListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
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

export interface GoogleLoginRequest {
  credential: string;
  role?: UserRole | null;
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
  name?: string | null;
  phone?: string | null;
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

// ─── Job Types ───────────────────────────────────────────────

export type JobLocationType = "Remote" | "On-site" | "Hybrid";
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type JobExperienceLevel = "Entry" | "Mid" | "Senior" | "Lead";
export type JobStatus = "active" | "closed";
export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "interview-scheduled"
  | "rejected"
  | "hired";

export interface JobResponseData {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: JobLocationType;
  salary: string;
  type: JobType;
  experienceLevel: JobExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline: string | null;
  employerId: string;
  matchScore: number | null;
  applicantsCount: number;
  status: JobStatus;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationResponseData {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  status: ApplicationStatus;
  appliedDate: string;
  resume: string | null;
  coverLetter: string | null;
  matchScore: number | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCounts {
  total: number;
  pending: number;
  shortlisted: number;
  interviewScheduled: number;
  rejected: number;
  hired: number;
}

export interface ApplicationsListResponse extends PaginatedListResponse<ApplicationResponseData> {
  counts: ApplicationCounts | null;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  locationType: JobLocationType;
  salary: string;
  type: JobType;
  experienceLevel: JobExperienceLevel;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  applicationDeadline?: string;
}

export type UpdateJobRequest = Partial<CreateJobRequest>;

export type JobsListResponse = PaginatedListResponse<JobResponseData>;

export interface JobsQueryParams extends PaginationQueryParams {
  search?: string;
  status?: JobStatus | "all";
  employerId?: string;
  type?: JobType;
  locationType?: JobLocationType;
  experienceLevel?: JobExperienceLevel;
  sortBy?: "postedDate" | "salary";
  sortOrder?: "asc" | "desc";
}

export interface ApplicationsQueryParams extends PaginationQueryParams {
  status?: ApplicationStatus | null;
  jobId?: string | null;
  search?: string | null;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  rejectionReason?: string | null;
}

export interface BookmarkResponse {
  bookmarked: boolean;
}

// ─── Interview Types ──────────────────────────────────────────

export type InterviewStatus = "scheduled" | "in-progress" | "completed" | "cancelled";
export type InterviewType = "ai" | "human";

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "behavioral" | "technical" | "situational" | "general";
  category: string;
  expectedDuration: number;
}

export interface InterviewResponseData {
  id: string;
  jobId: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string | null;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: InterviewStatus;
  type: InterviewType;
  meetingLink: string | null;
  notes: string | null;
  questions?: InterviewQuestion[] | null;
  responses?: Array<{ questionId: string; response: string; duration: number; timestamp: string }> | null;
  evaluation?: {
    overallScore?: number;
    technicalScore?: number;
    communicationScore?: number;
    problemSolvingScore?: number;
    cultureFitScore?: number;
    strengths?: string[];
    improvements?: string[];
    summary?: string;
  } | null;
  aiScore: number | null;
  aiSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewCounts {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface InterviewsListResponse extends PaginatedListResponse<InterviewResponseData> {
  counts: InterviewCounts;
}

export interface InterviewsQueryParams extends PaginationQueryParams {
  status?: InterviewStatus | null;
  type?: InterviewType | null;
}

export interface InterviewStartResponseData {
  interviewId: string;
  totalQuestions: number;
  questions: InterviewQuestion[];
}

export interface InterviewSubmitResponsesRequest {
  responses: Array<{ questionId: string; response: string; duration: number; timestamp: string }>;
}

export interface InterviewResultsData {
  aiScore: number;
  aiSummary: string;
  summary?: string;
  evaluation: {
    overallScore?: number;
    technicalScore?: number;
    communicationScore?: number;
    problemSolvingScore?: number;
    cultureFitScore?: number;
    strengths?: string[];
    improvements?: string[];
    summary?: string;
  } | null;
  responses?: Array<{ questionId: string; response: string; duration: number; timestamp: string }>;
}

// export interface ScheduleInterviewRequest {
//   applicationId: string;
//   scheduledDate: string;
//   scheduledTime: string;
//   duration: number;
//   type: InterviewType;
//   meetingLink?: string;
//   notes?: string;
// }

export interface ScheduleInterviewRequest {
  jobId: string;
  applicantId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  type: 'ai' | 'human';
  meetingLink?: string;
  notes?: string;
}

export type UpdateInterviewRequest = Partial<Omit<ScheduleInterviewRequest, "applicationId">>;

export interface ApplicationStatusUpdateRequest {
  status: "shortlisted" | "interview-scheduled" | "rejected" | "hired";
  rejectionReason?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────

export interface JobSeekerDashboardStats {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  interviewsScheduled: number;
  savedJobs: number;
}

export interface EmployerDashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  shortlistedApplications: number;
  hiredCandidates: number;
  interviewScheduled: number;
}

export type DashboardStats = JobSeekerDashboardStats | EmployerDashboardStats;

// ─── UI Types ─────────────────────────────────────────────────

export interface ModalState {
  id: string;
  props?: Record<string, unknown>;
}

export type ThemeMode = "light" | "dark" | "system";

export interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: ModalState | null;
  theme: ThemeMode;
}

// ─── API Tag Types (re-export from api/tags.ts) ──────────────

export type { ApiTagType } from "./api/tags";
export { TAG_TYPES as API_TAG_TYPES } from "./api/tags";
