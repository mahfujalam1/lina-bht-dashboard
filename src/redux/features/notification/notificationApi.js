import { baseApi } from "../../baseApi/baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query({
      query: () => ({
        url: "/admin/notification/settings",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    updateNotificationSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/notification/settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
    reloadScheduler: builder.mutation({
      query: () => ({
        url: "/admin/notification/scheduler/reload",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotificationHistory: builder.query({
      query: (params) => ({
        url: "/admin/notification/history",
        method: "GET",
        params,
      }),
      providesTags: ["NotificationHistory"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useReloadSchedulerMutation,
  useGetNotificationHistoryQuery,
} = notificationApi;
