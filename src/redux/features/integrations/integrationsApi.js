import { baseApi } from "../../baseApi/baseApi";

/**
 * @file integrationsApi.js
 * @description Redux Toolkit Query API endpoints for Third-Party Integrations.
 * Interacts with FastAPI backend `/admin/integrations/*`.
 * Provides full control over OpenAI, Anthropic, YouCam, RevenueCat, OneSignal, SMTP, AWS S3, MongoDB, and Apple Sign-In.
 */

export const integrationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @description Returns configuration state for all third-party APIs the backend uses.
     * @method GET /admin/integrations
     * @param {Object} [params]
     * @param {boolean} [params.probe=false] - Pass true to run live connectivity check against every provider.
     * @param {string} [params.category] - Filter by category (e.g., 'AI / LLM', 'Computer Vision', 'Payments & Subscriptions').
     * @returns {Object} { success: true, summary: {...}, categories: [...], integrations: [...] }
     * @example response:
     * {
     *   "success": true,
     *   "summary": { "total": 9, "configured": 9, "not_configured": 0, "editable": 3, "probed": false },
     *   "categories": ["AI / LLM", "Computer Vision", "Data & Infrastructure", "Identity & Auth", "Marketing & Notifications", "Payments & Subscriptions"],
     *   "integrations": [
     *     {
     *       "id": "openai",
     *       "name": "OpenAI",
     *       "category": "AI / LLM",
     *       "description": "Primary LLM backend.",
     *       "configured": true,
     *       "editable": true,
     *       "fields": [
     *         { "key": "OPENAI_API_KEY", "label": "API Key", "secret": true, "editable": true, "source": "environment", "value": "sk-pro••••••••••••nAgA" }
     *       ]
     *     }
     *   ]
     * }
     */
    listIntegrations: builder.query({
      query: (params = {}) => ({
        url: "/admin/integrations",
        method: "GET",
        params,
      }),
      providesTags: ["Integrations"],
    }),

    /**
     * @description Lightweight counts and status for dashboard headers — executes no external network calls.
     * @method GET /admin/integrations/summary
     * @returns {Object} summary counters, by_category breakdown, active_llm_backend, last_credential_change
     */
    getIntegrationsSummary: builder.query({
      query: () => ({
        url: "/admin/integrations/summary",
        method: "GET",
      }),
      providesTags: ["Integrations"],
    }),

    /**
     * @description Call volume and token consumption attributable to each provider over a lookback window.
     * @method GET /admin/integrations/usage
     * @param {Object} [params]
     * @param {number} [params.days=30] - Look-back window in days (1 - 365, max 30 days due to TTL retention)
     * @returns {Object} { success: true, usage: { window_days, since, by_provider, by_endpoint } }
     */
    getIntegrationsUsage: builder.query({
      query: (params = { days: 30 }) => ({
        url: "/admin/integrations/usage",
        method: "GET",
        params,
      }),
      providesTags: ["Integrations"],
    }),

    /**
     * @description Credential change history log. Never logs secret values.
     * @method GET /admin/integrations/audit
     * @param {Object} [params]
     * @param {number} [params.limit=50] - Number of audit records to return (1 - 500)
     * @returns {Object} { success: true, count: number, entries: [{ keys: [], cleared: [], admin_email, created_at }] }
     */
    getIntegrationsAudit: builder.query({
      query: (params = { limit: 50 }) => ({
        url: "/admin/integrations/audit",
        method: "GET",
        params,
      }),
      providesTags: ["Integrations"],
    }),

    /**
     * @description Run a parallel live health check against every integration's status endpoint.
     * @method POST /admin/integrations/test-all
     * @returns {Object} { success: true, summary: { total, healthy, unhealthy, failing: [] }, results: { [provider_id]: Health } }
     */
    testAllIntegrations: builder.mutation({
      query: () => ({
        url: "/admin/integrations/test-all",
        method: "POST",
      }),
      invalidatesTags: ["Integrations"],
    }),

    /**
     * @description Detailed configuration, masked keys, documentation URL, and 30-day usage for one provider.
     * @method GET /admin/integrations/{provider_id}
     * @param {Object} args
     * @param {string} args.providerId - e.g. "openai", "anthropic", "youcam", "revenuecat", "onesignal", "smtp", "aws_s3", "mongodb", "apple_signin"
     * @param {boolean} [args.probe=false] - Also run live health check
     */
    getIntegrationDetails: builder.query({
      query: ({ providerId, probe = false }) => ({
        url: `/admin/integrations/${providerId}`,
        method: "GET",
        params: { probe },
      }),
      providesTags: (result, error, { providerId }) => [
        { type: "Integrations", id: providerId },
      ],
    }),

    /**
     * @description Update a provider's editable credentials. Validates against the provider API before saving.
     * @method PUT /admin/integrations/{provider_id}/credentials
     * @param {Object} args
     * @param {string} args.providerId - e.g. "anthropic", "youcam", "openai"
     * @param {Object} args.body
     * @param {Object} args.body.values - Key-value map (e.g. { "ANTHROPIC_API_KEY": "sk-ant-..." })
     * @param {boolean} [args.body.verify=true] - Live verify against provider before committing to MongoDB
     */
    updateIntegrationCredentials: builder.mutation({
      query: ({ providerId, ...body }) => ({
        url: `/admin/integrations/${providerId}/credentials`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Integrations", "AiConfig"],
    }),

    /**
     * @description Clear one stored credential override, reverting to the deployment server's `.env`.
     * @method DELETE /admin/integrations/{provider_id}/credentials/{key}
     * @param {Object} args
     * @param {string} args.providerId - e.g. "anthropic", "youcam", "openai"
     * @param {string} args.key - Setting key name, e.g. "ANTHROPIC_API_KEY"
     */
    clearIntegrationCredential: builder.mutation({
      query: ({ providerId, key }) => ({
        url: `/admin/integrations/${providerId}/credentials/${key}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Integrations", "AiConfig"],
    }),

    /**
     * @description Run a live read-only health check against one integration with credentials currently in force.
     * @method POST /admin/integrations/{provider_id}/test
     * @param {string} providerId - e.g. "openai", "anthropic", "youcam", "revenuecat", "onesignal", "smtp", "aws_s3", "mongodb", "apple_signin"
     * @returns {Object} { success: true, provider: string, health: { status, ok, latency_ms, detail, info, checked_at } }
     */
    testSingleIntegration: builder.mutation({
      query: (providerId) => ({
        url: `/admin/integrations/${providerId}/test`,
        method: "POST",
      }),
      invalidatesTags: (result, error, providerId) => [
        { type: "Integrations", id: providerId },
      ],
    }),
  }),
});

export const {
  useListIntegrationsQuery,
  useGetIntegrationsSummaryQuery,
  useGetIntegrationsUsageQuery,
  useGetIntegrationsAuditQuery,
  useTestAllIntegrationsMutation,
  useGetIntegrationDetailsQuery,
  useUpdateIntegrationCredentialsMutation,
  useClearIntegrationCredentialMutation,
  useTestSingleIntegrationMutation,
} = integrationsApi;
