/* eslint-disable react/prop-types */
import { Button, Tag, Spin } from "antd";
import { FaCheckCircle, FaExclamationTriangle, FaHistory, FaBolt } from "react-icons/fa";

export default function IntegrationsSummaryBar({
  summaryData,
  isLoading,
  onTestAll,
  isTestingAll,
  onOpenAudit,
}) {
  const summary = summaryData;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Total & Configured Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f5ee] rounded-xl border border-[#d6e5d2] text-[#345c29]">
            <FaCheckCircle size={13} />
            <span className="text-xs font-semibold">
              {isLoading ? "..." : `${summary?.configured ?? 0} / ${summary?.total ?? 0} Configured`}
            </span>
          </div>

          {(summary?.not_configured ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf3ec] rounded-xl border border-[#f5d9c5] text-[#b44810]">
              <FaExclamationTriangle size={13} />
              <span className="text-xs font-semibold">
                {summary?.not_configured} Incomplete
              </span>
            </div>
          )}
        </div>

        {/* Active LLM Architecture Pill */}
        {summary?.active_llm_backend && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#78644e] bg-[#f7f3ee] px-3 py-1.5 rounded-xl border border-[#e8dfd3]">
            <span className="text-[#a08f7a] font-medium">Active AI:</span>
            <span className="font-mono font-semibold text-[#423423] truncate max-w-[260px]">
              {summary.active_llm_backend}
            </span>
          </div>
        )}

        {/* Last change indicator */}
        {summary?.last_credential_change && (
          <span className="text-[11px] text-[#9a8a77]">
            Last updated: {new Date(summary.last_credential_change).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-start lg:self-auto">
        <Button
          icon={<FaHistory size={12} />}
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 !bg-[#f5f0eb] !border-[#e7e0d7] !text-[#5c4a32] !rounded-xl !h-9 !px-3.5 !text-xs !font-medium hover:!bg-[#e8e0d8]"
        >
          Audit Log
        </Button>

        <Button
          icon={<FaBolt size={12} className={isTestingAll ? "animate-pulse" : ""} />}
          loading={isTestingAll}
          onClick={onTestAll}
          className="flex items-center gap-1.5 !bg-[#2d2416] !border-[#2d2416] !text-white !rounded-xl !h-9 !px-4 !text-xs !font-medium hover:!bg-[#453724]"
        >
          Test All Connections
        </Button>
      </div>
    </div>
  );
}
