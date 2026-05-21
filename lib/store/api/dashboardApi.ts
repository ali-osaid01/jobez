import { baseApi } from "./baseApi";
import type { DashboardStats, ApiResponse } from "../types";

// ─── Dashboard API ───────────────────────────────────────────

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /dashboard/stats — role-specific dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      transformResponse: (response: ApiResponse<DashboardStats>) => response.data,
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────

export const { useGetDashboardStatsQuery } = dashboardApi;
