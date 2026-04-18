import { baseApi } from "./baseApi";
import { updateUser } from "../features/authSlice";
import type {
  UpdateProfileRequest,
  ProfileResponseData,
  ResumeExtractResponseData,
  ApiResponse,
} from "../types";

// ─── Profile API ─────────────────────────────────────────────

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponseData, void>({
      query: () => "/profile/me",
      transformResponse: (response: ApiResponse<ProfileResponseData>) =>
        response.data,
      providesTags: ["Profile", "User"],
    }),

    updateProfile: builder.mutation<ProfileResponseData, UpdateProfileRequest>({
      query: (body) => ({
        url: "/profile/me",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<ProfileResponseData>) =>
        response.data,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData("getProfile", undefined, (draft) => {
            if (typeof _args.name !== "undefined" && _args.name !== null) {
              draft.name = _args.name;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          // Response is flat — extract auth-relevant fields to sync Redux auth state
          dispatch(
            updateUser({
              name: _args.name ?? data.name,
              email: data.email,
              phone: data.phone,
              onboardingComplete: data.onboardingComplete,
            }),
          );
        } catch {
          patchResult.undo();
          // Error handled by component via the mutation hook
        }
      },
    }),

    extractResume: builder.mutation<ResumeExtractResponseData, FormData>({
      query: (formData) => ({
        url: "/profile/resume/extract",
        method: "POST",
        body: formData,
        // Let browser set Content-Type with boundary for FormData
        formData: true,
      }),
      transformResponse: (response: ApiResponse<ResumeExtractResponseData>) =>
        response.data,
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useExtractResumeMutation,
} = profileApi;
