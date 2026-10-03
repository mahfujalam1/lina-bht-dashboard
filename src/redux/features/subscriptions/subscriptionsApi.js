import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionOverview: builder.query({
      query: () => ({
        url: "/admin/subscription/overview",
        method: "GET",
      }),
      providesTags: [tagTypes.subscriptions],
    }),
    getPlans: builder.query({
      query: () => ({
        url: "/admin/subscription/plans",
        method: "GET",
      }),
      providesTags: [tagTypes.subscriptions],
    }),
    updateBasicPlan: builder.mutation({
      query: (data) => ({
        url: "/admin/subscription/plans/basic",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.subscriptions],
    }),
    updatePremiumPlan: builder.mutation({
      query: (data) => ({
        url: "/admin/subscription/plans/premium",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.subscriptions],
    }),
  }),
});

export const {
  useGetSubscriptionOverviewQuery,
  useGetPlansQuery,
  useUpdateBasicPlanMutation,
  useUpdatePremiumPlanMutation,
} = subscriptionsApi;

