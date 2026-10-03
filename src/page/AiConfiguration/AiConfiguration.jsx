/* eslint-disable react/prop-types */
import { useState } from "react";
import { Spin } from "antd";
import { GiArtificialIntelligence } from "react-icons/gi";
import { TbPlugConnected, TbChartBar } from "react-icons/tb";
import { toast } from "sonner";
import {
  useCheckModelUpdatesMutation,
  useGetAiConfigQuery,
  useGetLimitsQuery,
  useUpdateEndpointLimitMutation,
} from "../../redux/features/aiConfig/aiConfigApi";
import AiConfigTab from "./components/AiConfigTab";
import IntegrationsTab from "./components/IntegrationsTab";
import IntegrationsUsageTab from "./components/IntegrationsUsageTab";
import UsageLimitsSidebar from "./components/UsageLimitsSidebar";
import EditLimitModal from "./components/EditLimitModal";
import UpdateAiKeyModal from "./components/UpdateAiKeyModal";

export default function AIConfiguration() {
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "integrations" | "usage"

  // Queries & Mutations
  const { data: configData, isLoading: isLoadingConfig } = useGetAiConfigQuery();
  const { data: limitsData, isLoading: isLoadingLimits } = useGetLimitsQuery();
  const [updateEndpointLimit, { isLoading: isUpdatingLimit }] =
    useUpdateEndpointLimitMutation();
  const [checkModelUpdates, { isLoading: isCheckingUpdates }] =
    useCheckModelUpdatesMutation();

  const [checkUpdatesResult, setCheckUpdatesResult] = useState(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Local state for limit editing
  const [editingLimit, setEditingLimit] = useState(null);
  const [limitForm, setLimitForm] = useState({});

  const handleCheckUpdates = async () => {
    try {
      const res = await checkModelUpdates().unwrap();
      setCheckUpdatesResult(res);
      toast.success("Live model updates verified successfully!");
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to probe model updates");
    }
  };

  const openLimitModal = (limit) => {
    setEditingLimit(limit);
    setLimitForm({
      freeValue:
        limit.type === "token" ? limit.free_token_budget : limit.free_max_uses,
      freePeriod: limit.free_period_days,
      premiumValue:
        limit.type === "token"
          ? limit.premium_token_budget
          : limit.premium_max_uses,
      premiumPeriod: limit.premium_period_days,
    });
  };

  const handleUpdateLimit = async () => {
    if (
      Object.values(limitForm).some(
        (value) => value === null || value === undefined
      )
    ) {
      toast.error("All limit fields are required");
      return;
    }

    try {
      const isToken = editingLimit.type === "token";
      await updateEndpointLimit({
        endpointId: editingLimit.endpoint_id,
        free_period_days: limitForm.freePeriod,
        premium_period_days: limitForm.premiumPeriod,
        ...(isToken
          ? {
              free_token_budget: limitForm.freeValue,
              premium_token_budget: limitForm.premiumValue,
            }
          : {
              free_max_uses: limitForm.freeValue,
              premium_max_uses: limitForm.premiumValue,
            }),
      }).unwrap();
      toast.success("Usage limits updated successfully!");
      setEditingLimit(null);
    } catch (error) {
      toast.error(
        error?.data?.detail?.[0]?.msg ||
          error?.data?.detail ||
          "Failed to update limits"
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d2416]">
          AI &amp; Integrations
        </h1>
        <p className="text-sm text-[#9a8a77] mt-0.5">
          Manage assistant behavior, diagnostic LLM engines, and third-party API integrations.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e8dfd3] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "ai"
              ? "bg-[#2d2416] text-white shadow-sm"
              : "bg-white text-[#705e49] border border-[#e8dfd3] hover:bg-[#f7f2ea]"
          }`}
        >
          <GiArtificialIntelligence size={16} />
          AI Assistant &amp; Models
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "integrations"
              ? "bg-[#2d2416] text-white shadow-sm"
              : "bg-white text-[#705e49] border border-[#e8dfd3] hover:bg-[#f7f2ea]"
          }`}
        >
          <TbPlugConnected size={16} />
          Third-Party Integrations
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("usage")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "usage"
              ? "bg-[#2d2416] text-white shadow-sm"
              : "bg-white text-[#705e49] border border-[#e8dfd3] hover:bg-[#f7f2ea]"
          }`}
        >
          <TbChartBar size={16} />
          Call Volume &amp; Usage
        </button>
      </div>

      {/* Main Content Layout */}
      {isLoadingConfig ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-[#eee9e2]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex gap-6 flex-col lg:flex-row items-start">
          {/* Left Column: Active Sub-Tab View */}
          <div className="min-w-0 flex-1 w-full">
            {activeTab === "ai" && (
              <AiConfigTab
                configData={configData}
                onCheckUpdates={handleCheckUpdates}
                isCheckingUpdates={isCheckingUpdates}
                checkUpdatesResult={checkUpdatesResult}
                onOpenKeyModal={() => setIsKeyModalOpen(true)}
              />
            )}

            {activeTab === "integrations" && <IntegrationsTab />}

            {activeTab === "usage" && <IntegrationsUsageTab />}
          </div>

          {/* Right Column: Usage Limits Sidebar */}
          <UsageLimitsSidebar
            limitsData={limitsData}
            isLoadingLimits={isLoadingLimits}
            onEditLimit={openLimitModal}
          />
        </div>
      )}

      {/* Limit Editor Modal */}
      <EditLimitModal
        editingLimit={editingLimit}
        limitForm={limitForm}
        setLimitForm={setLimitForm}
        onSave={handleUpdateLimit}
        onCancel={() => setEditingLimit(null)}
        isLoading={isUpdatingLimit}
      />

      {/* Update AI Key Modal */}
      <UpdateAiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
}
