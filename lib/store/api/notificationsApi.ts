import { baseApi } from "./baseApi";
import type { ApiResponse, NotificationsListResponse, NotificationResponseData } from "../types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsListResponse, { page?: number; limit?: number; unreadOnly?: boolean } | void>({
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
        return `/notifications${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: NotificationsListResponse) => response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Notification" as const, id })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    markNotificationRead: builder.mutation<NotificationResponseData, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<NotificationResponseData>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notifications", id: "LIST" },
      ],
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
