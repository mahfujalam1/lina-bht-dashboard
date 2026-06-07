import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const termAndPolicy = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: `/legal/privacy`,
        method: "GET",
      }),
      providesTags: [tagTypes.policy],
    }),

    getTerms: builder.query({
      query: () => ({
        url: `/legal/terms`,
        method: "GET",
      }),
      providesTags: [tagTypes.terms],
    }),

    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: `/admin/legal/privacy`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.policy],
    }),

    updateTerms: builder.mutation({
      query: (data) => ({
        url: `/admin/legal/terms`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.terms],
    }),
  }),
});

export const {
  useGetPrivacyQuery,
  useGetTermsQuery,
  useUpdatePrivacyMutation,
  useUpdateTermsMutation,
} = termAndPolicy;
