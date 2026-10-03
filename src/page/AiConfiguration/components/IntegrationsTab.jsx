/* eslint-disable react/prop-types */
import { useState } from "react";
import { Spin } from "antd";
import { toast } from "sonner";
import {
  useListIntegrationsQuery,
  useGetIntegrationsSummaryQuery,
  useTestAllIntegrationsMutation,
} from "../../../redux/features/integrations/integrationsApi";
import IntegrationsSummaryBar from "./IntegrationsSummaryBar";
import IntegrationCard from "./IntegrationCard";
import EditCredentialModal from "./EditCredentialModal";
import IntegrationDetailsModal from "./IntegrationDetailsModal";
import IntegrationAuditModal from "./IntegrationAuditModal";

export default function IntegrationsTab() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProvider, setEditingProvider] = useState(null);
  const [detailsProviderId, setDetailsProviderId] = useState(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetIntegrationsSummaryQuery();
  const { data: integrationsData, isLoading: isLoadingList } =
    useListIntegrationsQuery();
  const [testAllIntegrations, { isLoading: isTestingAll }] =
    useTestAllIntegrationsMutation();

  const handleTestAll = async () => {
    try {
      const res = await testAllIntegrations().unwrap();
      const healthy = res.summary?.healthy ?? 0;
      const total = res.summary?.total ?? 0;
      toast.success(`Completed live tests: ${healthy}/${total} healthy`);
      if (res.summary?.failing?.length > 0) {
        toast.warning(`Failing services: ${res.summary.failing.join(", ")}`);
      }
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to test all integrations");
    }
  };

  const categories = [
    "All",
    ...(integrationsData?.categories || []),
  ];

  const filteredIntegrations =
    integrationsData?.integrations?.filter((p) => {
      if (selectedCategory === "All") return true;
      return p.category?.toLowerCase() === selectedCategory.toLowerCase();
    }) || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Summary Counter & Actions Bar */}
      <IntegrationsSummaryBar
        summaryData={summaryData}
        isLoading={isLoadingSummary}
        onTestAll={handleTestAll}
        isTestingAll={isTestingAll}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#2d2416] text-white shadow-sm"
                : "bg-white text-[#705e49] border border-[#e8dfd3] hover:bg-[#f7f2ea]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      {isLoadingList ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-[#eee9e2]">
          <Spin size="large" />
        </div>
      ) : filteredIntegrations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#eee9e2]">
          <p className="text-xs text-[#9a8a77]">No integrations found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIntegrations.map((provider) => (
            <IntegrationCard
              key={provider.id}
              provider={provider}
              onEdit={(p) => setEditingProvider(p)}
              onViewDetails={(p) => setDetailsProviderId(p.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EditCredentialModal
        provider={editingProvider}
        isOpen={Boolean(editingProvider)}
        onClose={() => setEditingProvider(null)}
      />

      <IntegrationDetailsModal
        providerId={detailsProviderId}
        isOpen={Boolean(detailsProviderId)}
        onClose={() => setDetailsProviderId(null)}
      />

      <IntegrationAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />
    </div>
  );
}
