import { baseApi } from "../../baseApi/baseApi";

const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionOverview: builder.query({
      query: () => ({
        url: "/admin/subscription/overview",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
  }),
});

export const { useGetSubscriptionOverviewQuery } = subscriptionsApi;
