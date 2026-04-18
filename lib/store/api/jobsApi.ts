import { baseApi } from "./baseApi";
import type {
  JobResponseData,
  ApplicationResponseData,
  CreateJobRequest,
  UpdateJobRequest,
  JobsListResponse,
  JobsQueryParams,
  ApplicationsListResponse,
  ApplicationsQueryParams,
  BookmarkResponse,
  ApiResponse,
} from "../types";

// ─── Jobs API ────────────────────────────────────────────────

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /jobs — browse/search with filters & pagination
    getJobs: builder.query<JobsListResponse, JobsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          const queryKeyMap: Record<string, string> = {
            employerId: "employer_id",
            type: "job_type",
            locationType: "location_type",
            experienceLevel: "experience_level",
            sortBy: "sort_by",
            sortOrder: "sort_order",
          };

          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.set(queryKeyMap[key] ?? key, String(value));
            }
          });
        }
        const qs = searchParams.toString();
        return `/jobs${qs ? `?${qs}` : ""}`;
      },
      // This endpoint returns paginated response directly (not wrapped in ApiResponse)
      transformResponse: (response: JobsListResponse) => response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Job" as const, id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }],
    }),

    // GET /jobs/recommended — AI-recommended jobs (job-seeker)
    getRecommendedJobs: builder.query<JobResponseData[], void>({
      query: () => "/jobs/recommended",
      transformResponse: (response: ApiResponse<JobResponseData[]>) =>
        response.data,
      providesTags: [{ type: "Jobs", id: "RECOMMENDED" }],
    }),

    // GET /jobs/:id — single job detail
    getJobById: builder.query<JobResponseData, string>({
      query: (id) => `/jobs/${id}`,
      transformResponse: (response: ApiResponse<JobResponseData>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),

    // GET /applications — fetch current user's applications (optionally filtered)
    getApplications: builder.query<ApplicationsListResponse, ApplicationsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.set(key, String(value));
            }
          });
        }
        const qs = searchParams.toString();
        return `/applications${qs ? `?${qs}` : ''}`;
      },
      transformResponse: (response: ApplicationsListResponse) => response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Applications' as const, id })),
              { type: 'Applications', id: 'LIST' },
            ]
          : [{ type: 'Applications', id: 'LIST' }],
    }),

    // POST /jobs — create a new job (employer)
    createJob: builder.mutation<JobResponseData, CreateJobRequest>({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<JobResponseData>) =>
        response.data,
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),

    // PATCH /jobs/:id — update job (employer/owner)
    updateJob: builder.mutation<
      JobResponseData,
      { id: string; body: UpdateJobRequest }
    >({
      query: ({ id, body }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<JobResponseData>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Job", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),

    // DELETE /jobs/:id — close job (soft delete)
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Job", id },
        { type: "Jobs", id: "LIST" },
      ],
    }),

    // POST /jobs/:id/bookmark — toggle bookmark
    toggleBookmark: builder.mutation<BookmarkResponse, string>({
      query: (id) => ({
        url: `/jobs/${id}/bookmark`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<BookmarkResponse>) =>
        response.data,
      invalidatesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),

    // POST /applications — submit an application for the current job seeker
    // Backend contract (OpenAPI): { jobId: string, resume?: string | null, coverLetter?: string | null }
    applyForJob: builder.mutation<void, string>({
      query: (id) => ({
        url: "/applications",
        method: "POST",
        body: { jobId: id },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Job", id },
        { type: "Jobs", id: "LIST" },
        { type: "Applications", id: "LIST" },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const {
  useGetJobsQuery,
  useGetRecommendedJobsQuery,
  useGetJobByIdQuery,
  useGetApplicationsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useToggleBookmarkMutation,
  useApplyForJobMutation,
} = jobsApi;
