import { baseApi } from "../../baseApi/baseApi";

/**
 * @file aiConfigApi.js
 * @description Redux Toolkit Query API endpoints for SkinSense AI Configuration & Model Management.
 * Communicates directly with FastAPI backend `/admin/ai-config` and `/admin/limits`.
 */

export const aiConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @description Fetch live AI engine configuration, architecture strategy, diagnostic pipelines, and real usage quotas.
     * @method GET /admin/ai-config
     * @returns {Object} response
     * @example response:
     * {
     *   "success": true,
     *   "config": {
     *     "tone": "Professional & Empathetic", // Supported: "Professional & Empathetic" | "Friendly & Casual" | "Clinical & Precise" | "Warm & Nurturing"
     *     "system_prompt_override": "Prioritize barrier health...",
     *     "architecture": {
     *       "strategy": "OpenAI Primary with Automatic Anthropic Fallback",
     *       "primary": { "provider": "OpenAI", "model": "gpt-6-luna", "status": "Active" },
     *       "fallback": { "provider": "Anthropic Claude", "model": "claude-haiku-4-5-20251001", "status": "Standby / Fallback" }
     *     },
     *     "pipelines": { "face_scan": {...}, "scalp_hair": {...}, "microscopic_skin": {...}, "ingredient_parser": {...}, "lia_chat": {...} }
     *   },
     *   "api_usage": {
     *     "requests_used": 150,
     *     "requests_breakdown": { "face_scans": 20, "scalp_scans": 10, "product_scans": 30, "assistant_chats": 90 },
     *     "monthly_quota": 1000000,
     *     "percentage": 0.015
     *   }
     * }
     */
    getAiConfig: builder.query({
      query: () => ({
        url: "/admin/ai-config",
        method: "GET",
      }),
      providesTags: ["AiConfig"],
    }),

    /**
     * @description Save runtime AI configurations. Takes effect immediately in production.
     * @method POST /admin/ai-config/save
     * @param {Object} data
     * @param {string} [data.tone] - Personality tone preset. Supported: "Professional & Empathetic", "Friendly & Casual", "Clinical & Precise", "Warm & Nurturing"
     * @param {string} [data.system_prompt_override] - Global instructions prepended to assistant prompts
     * @param {string} [data.openai_model] - Primary OpenAI model ID (e.g. "gpt-6-luna", "gpt-4o", "gpt-4o-mini")
     * @param {string} [data.anthropic_model] - Fallback Claude model ID (e.g. "claude-haiku-4-5-20251001", "claude-3-5-sonnet-20241022")
     * @param {number} [data.monthly_quota] - Monthly API request budget limit
     */
    saveAiConfig: builder.mutation({
      query: (data) => ({
        url: "/admin/ai-config/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiConfig"],
    }),

    /**
     * @description Updates OpenAI or Anthropic API key with live verification against the provider before saving.
     * @method POST /admin/ai-config/update-key
     * @param {Object} data
     * @param {string} data.api_key - New API key starting with 'sk-' (OpenAI) or 'sk-ant-' (Anthropic)
     * @param {string} [data.provider] - 'openai' | 'anthropic'. Auto-detected if omitted.
     * @returns {Object} response with live check status and latency
     */
    updateApiKey: builder.mutation({
      query: (data) => ({
        url: "/admin/ai-config/update-key",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiConfig", "Integrations"],
    }),

    /**
     * @description Live model discovery probe against OpenAI and Anthropic official APIs.
     * @method POST /admin/ai-config/check-updates
     * @returns {Object} response with latency, model status, and verified boolean
     * @example response:
     * {
     *   "success": true,
     *   "primary_backend": { "provider": "OpenAI", "active_model": "gpt-6-luna", "status": "healthy", "latency_ms": 280, "model_verified": true },
     *   "fallback_backend": { "provider": "Anthropic Claude", "active_model": "claude-haiku-4-5-20251001", "status": "healthy", "latency_ms": 310, "model_verified": true },
     *   "all_systems_operational": true
     * }
     */
    checkModelUpdates: builder.mutation({
      query: () => ({
        url: "/admin/ai-config/check-updates",
        method: "POST",
      }),
      invalidatesTags: ["AiConfig"],
    }),

    /**
     * @description Get rate and volume limits for diagnostic and chat endpoints.
     * @method GET /admin/limits
     */
    getLimits: builder.query({
      query: () => ({ url: "/admin/limits", method: "GET" }),
      providesTags: ["Limits"],
    }),

    /**
     * @description Update usage limits and plan allowances for an endpoint.
     * @method PUT /admin/limits/{endpointId}
     */
    updateEndpointLimit: builder.mutation({
      query: ({ endpointId, ...body }) => ({
        url: `/admin/limits/${endpointId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Limits"],
    }),

    /**
     * @description Get recent 24h call and token usage for an endpoint.
     * @method GET /admin/limits/{endpointId}/usage
     */
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
