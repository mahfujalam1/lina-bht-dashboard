import { baseApi } from "../../baseApi/baseApi";

const aiConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiConfig: builder.query({
      query: () => ({
        url: "/admin/ai-config",
        method: "GET",
      }),
      providesTags: ["AiConfig"],
    }),
    saveAiConfig: builder.mutation({
      query: (data) => ({
        url: "/admin/ai-config/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiConfig"],
    }),
    updateApiKey: builder.mutation({
      query: (data) => ({
        url: "/admin/ai-config/update-key",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiConfig"],
    }),
    checkModelUpdates: builder.mutation({
      query: () => ({
        url: "/admin/ai-config/check-updates",
        method: "POST",
      }),
      invalidatesTags: ["AiConfig"],
    }),
    getLimits: builder.query({
      query: () => ({ url: "/admin/limits", method: "GET" }),
      providesTags: ["Limits"],
    }),
    updateEndpointLimit: builder.mutation({
      query: ({ endpointId, ...body }) => ({
        url: `/admin/limits/${endpointId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Limits"],
    }),
    getEndpointUsage: builder.query({
      query: (endpointId) => ({
        url: `/admin/limits/${endpointId}/usage`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAiConfigQuery,
  useSaveAiConfigMutation,
  useUpdateApiKeyMutation,
  useCheckModelUpdatesMutation,
  useGetLimitsQuery,
  useUpdateEndpointLimitMutation,
  useGetEndpointUsageQuery,
} = aiConfigApi;
