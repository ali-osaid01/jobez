import { baseApi } from "./baseApi";
import type {
  InterviewStartResponseData,
  ApiResponse,
} from "../types";

// ─── Interviews API ──────────────────────────────────────────

export const interviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startInterview: builder.mutation<InterviewStartResponseData, string>({
      query: (interviewId) => ({
        url: `/interviews/${interviewId}/start`,
        method: "POST",
        body: {}, // Explicit empty body
      }),
      transformResponse: (response: ApiResponse<InterviewStartResponseData>) =>
        response.data,
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const {
  useStartInterviewMutation,
} = interviewsApi;
