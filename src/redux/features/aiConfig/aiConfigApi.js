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
  }),
});

export const {
  useGetAiConfigQuery,
  useSaveAiConfigMutation,
  useUpdateApiKeyMutation,
  useCheckModelUpdatesMutation,
} = aiConfigApi;
