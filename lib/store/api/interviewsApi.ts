import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  InterviewResponseData,
  InterviewResultsData,
  InterviewsListResponse,
  InterviewsQueryParams,
  InterviewStartResponseData,
  InterviewSubmitResponsesRequest,
  ScheduleInterviewRequest,
  UpdateInterviewRequest,
} from "../types";

// ─── Interviews API ──────────────────────────────────────────

export const interviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /interviews — list with filters & pagination
    getInterviews: builder.query<InterviewsListResponse, InterviewsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              searchParams.set(key, String(value));
            }
          });
        }
        const qs = searchParams.toString();
        return `/interviews${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: InterviewsListResponse) => response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Interview" as const, id })),
              { type: "Interviews", id: "LIST" },
            ]
          : [{ type: "Interviews", id: "LIST" }],
    }),

    // GET /interviews/:id — single interview
    getInterviewById: builder.query<InterviewResponseData, string>({
      query: (id) => `/interviews/${id}`,
      transformResponse: (response: ApiResponse<InterviewResponseData>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Interview", id }],
    }),

    // POST /interviews/:id/start — start AI interview
    startInterview: builder.mutation<InterviewStartResponseData, string>({
      query: (interviewId) => ({
        url: `/interviews/${interviewId}/start`,
        method: "POST",
        body: {},
      }),
      transformResponse: (response: ApiResponse<InterviewStartResponseData>) => response.data,
      invalidatesTags: (_result, _error, id) => [{ type: "Interview", id }],
    }),

    // POST /interviews/:id/responses — submit all answers
    submitInterviewResponses: builder.mutation<
      void,
      { interviewId: string; responses: InterviewSubmitResponsesRequest["responses"] }
    >({
      query: ({ interviewId, responses }) => ({
        url: `/interviews/${interviewId}/responses`,
        method: "POST",
        body: { responses },
      }),
      invalidatesTags: (_result, _error, { interviewId }) => [
        { type: "Interview", id: interviewId },
        { type: "Interviews", id: "LIST" },
      ],
    }),

    // GET /interviews/:id/results — AI evaluation results
    getInterviewResults: builder.query<InterviewResultsData, string>({
      query: (id) => `/interviews/${id}/results`,
      transformResponse: (response: ApiResponse<InterviewResultsData>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Interview", id }],
    }),

    // POST /interviews — schedule interview (employer)
    scheduleInterview: builder.mutation<InterviewResponseData, ScheduleInterviewRequest>({
      query: (body) => ({
        url: "/interviews",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<InterviewResponseData>) => response.data,
      invalidatesTags: [
        { type: "Interviews", id: "LIST" },
        { type: "Applications", id: "LIST" },
      ],
    }),

    // PATCH /interviews/:id — update interview (employer)
    updateInterview: builder.mutation<
      InterviewResponseData,
      { id: string; body: UpdateInterviewRequest }
    >({
      query: ({ id, body }) => ({
        url: `/interviews/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<InterviewResponseData>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Interview", id },
        { type: "Interviews", id: "LIST" },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const {
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  useStartInterviewMutation,
  useSubmitInterviewResponsesMutation,
  useGetInterviewResultsQuery,
  useScheduleInterviewMutation,
  useUpdateInterviewMutation,
} = interviewsApi;
