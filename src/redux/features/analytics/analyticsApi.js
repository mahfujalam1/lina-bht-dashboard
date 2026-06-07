import { baseApi } from "../../baseApi/baseApi";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query({
      query: ({ period, age_group, gender }) => ({
        url: "/admin/analytics/user-dashboard",
        method: "GET",
        params: { period, age_group, gender },
      }),
      providesTags: ["Analytics"],
    }),
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "/admin/analytics/users",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetUserDashboardQuery, useGetUsersAnalyticsQuery } = analyticsApi;
