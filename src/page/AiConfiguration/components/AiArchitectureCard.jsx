/* eslint-disable react/prop-types */
import { Button, Tag, Progress } from "antd";
import { FaSync, FaKey, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
import { TbSettings2, TbCpu, TbActivity } from "react-icons/tb";

export default function AiArchitectureCard({
  configData,
  onCheckUpdates,
  isCheckingUpdates,
  checkUpdatesResult,
  onOpenKeyModal,
}) {
  const config = configData?.config;
  const architecture = config?.architecture;
  const usage = configData?.api_usage;
  const pipelines = config?.pipelines || {};

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee9e2] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4ee] flex items-center justify-center text-[#8b9e7a]">
            <TbSettings2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#2d2416]">
              Diagnostic Architecture &amp; LLM Engines
            </h2>
            <p className="text-xs text-[#9a8a77]">
              {architecture?.strategy || "Multi-tiered AI infrastructure with automated provider fallback"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<FaKey size={12} />}
            onClick={() => onOpenKeyModal()}
            className="flex items-center gap-1.5 !bg-[#f5f0eb] !border-[#e7e0d7] !text-[#5c4a32] !rounded-xl !h-9 !px-3.5 !text-xs !font-medium hover:!bg-[#e8e0d8]"
          >
            Update API Keys
          </Button>
          <Button
            icon={<FaSync size={11} className={isCheckingUpdates ? "animate-spin" : ""} />}
            loading={isCheckingUpdates}
            onClick={onCheckUpdates}
            className="flex items-center gap-1.5 !bg-[#2d2416] !border-[#2d2416] !text-white !rounded-xl !h-9 !px-3.5 !text-xs !font-medium hover:!bg-[#453724]"
          >
            Live Probe
          </Button>
        </div>
      </div>

      {/* Live Probe Result Banner */}
      {checkUpdatesResult && (
        <div className="bg-[#f0f5ee] border border-[#cfdfcb] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3b6330]">
              <FaCheckCircle /> Live Model Probe Completed
            </span>
            <span className="text-[11px] text-[#6b8560]">
              Checked at: {new Date(checkUpdatesResult.checked_at).toLocaleTimeString()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="bg-white/80 rounded-lg p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2d2416]">
                  {checkUpdatesResult.primary_backend?.provider}
                </span>
                <Tag color="green" className="!rounded-md !text-[10px]">
                  {checkUpdatesResult.primary_backend?.latency_ms} ms
                </Tag>
              </div>
              <p className="text-[11px] text-[#736350] mt-1">
                Active: {checkUpdatesResult.primary_backend?.active_model}
              </p>
            </div>
            <div className="bg-white/80 rounded-lg p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2d2416]">
                  {checkUpdatesResult.fallback_backend?.provider}
                </span>
                <Tag color="green" className="!rounded-md !text-[10px]">
                  {checkUpdatesResult.fallback_backend?.latency_ms} ms
                </Tag>
              </div>
              <p className="text-[11px] text-[#736350] mt-1">
                Active: {checkUpdatesResult.fallback_backend?.active_model}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary & Fallback LLM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary LLM */}
        <div className="bg-[#fcfaf7] border border-[#e8e2d9] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b9e7a] flex items-center gap-1">
                <TbCpu size={14} /> Primary Engine
              </span>
              <Tag color="green" className="!rounded-full !px-2.5 !py-0.5 !text-[11px] !font-semibold">
                {architecture?.primary?.status || "Active"}
              </Tag>
            </div>
            <h3 className="text-sm font-bold text-[#2d2416]">
              {architecture?.primary?.provider || "OpenAI"}
            </h3>
            <p className="text-xs font-mono text-[#5c4a32] mt-0.5">
              Model: {architecture?.primary?.model || "gpt-6-luna"}
            </p>
            <p className="text-[11px] text-[#9a8a77] mt-1">
              Handles standard facial, scalp, and skin diagnostic narratives and routine logic.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ede7df]">
            <span className="text-[11px] font-mono text-[#9a8a77]">
              Key: {usage?.openai?.masked_key || "••••••••••••"}
            </span>
            {architecture?.primary?.docs_url && (
              <a
                href={architecture.primary.docs_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#8b7355] hover:underline flex items-center gap-1"
              >
                Docs <FaExternalLinkAlt size={9} />
              </a>
            )}
          </div>
        </div>

        {/* Fallback LLM */}
        <div className="bg-[#fcfaf7] border border-[#e8e2d9] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a08f7a] flex items-center gap-1">
                <TbCpu size={14} /> Fallback Engine
              </span>
              <Tag color="orange" className="!rounded-full !px-2.5 !py-0.5 !text-[11px] !font-semibold">
                {architecture?.fallback?.status || "Standby / Fallback"}
              </Tag>
            </div>
            <h3 className="text-sm font-bold text-[#2d2416]">
              {architecture?.fallback?.provider || "Anthropic Claude"}
            </h3>
            <p className="text-xs font-mono text-[#5c4a32] mt-0.5">
              Model: {architecture?.fallback?.model || "claude-haiku-4-5-20251001"}
            </p>
            <p className="text-[11px] text-[#9a8a77] mt-1">
              Engages automatically if OpenAI latency spikes, quota exhausts, or 5xx occurs.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ede7df]">
            <span className="text-[11px] font-mono text-[#9a8a77]">
              Key: {usage?.anthropic?.masked_key || "••••••••••••"}
            </span>
            {architecture?.fallback?.docs_url && (
              <a
                href={architecture.fallback.docs_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#8b7355] hover:underline flex items-center gap-1"
              >
                Docs <FaExternalLinkAlt size={9} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Quota & Call Volume Bar */}
      {usage && (
        <div className="bg-[#f7f4f0] rounded-xl p-4 border border-[#e8e2d9]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TbActivity className="text-[#8b9e7a]" size={16} />
              <span className="text-xs font-semibold text-[#2d2416]">
                Monthly API Quota Utilization
              </span>
            </div>
            <span className="text-xs font-bold text-[#2d2416]">
              {(usage.requests_used ?? 0).toLocaleString()} / {(usage.monthly_quota ?? 0).toLocaleString()} calls ({usage.percentage ?? 0}%)
            </span>
          </div>
          <Progress
            percent={Math.min(100, usage.percentage ?? 0)}
            strokeColor="#8b9e7a"
            trailColor="#e8e2d9"
            showInfo={false}
          />
          {usage.requests_breakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#e8e2d9] text-[11px]">
              <div>
                <span className="text-[#9a8a77]">Face Scans:</span>{" "}
                <strong className="text-[#2d2416]">{usage.requests_breakdown.face_scans ?? 0}</strong>
              </div>
              <div>
                <span className="text-[#9a8a77]">Scalp Scans:</span>{" "}
                <strong className="text-[#2d2416]">{usage.requests_breakdown.scalp_scans ?? 0}</strong>
              </div>
              <div>
                <span className="text-[#9a8a77]">Product Scans:</span>{" "}
                <strong className="text-[#2d2416]">{usage.requests_breakdown.product_scans ?? 0}</strong>
              </div>
              <div>
                <span className="text-[#9a8a77]">Coach Chats:</span>{" "}
                <strong className="text-[#2d2416]">{usage.requests_breakdown.assistant_chats ?? 0}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real Diagnostic Pipelines List */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32] mb-3">
          Specialized Diagnostic Pipelines
        </h3>
        <div className="flex flex-col gap-2.5">
          {Object.entries(pipelines).map(([key, pipeline]) => (
            <div
              key={key}
              className="bg-[#fbf9f6] rounded-xl px-4 py-3 border border-[#eee9e2] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-[#2d2416]">{pipeline.name}</p>
                  {pipeline.mode && (
                    <span className="text-[10px] text-[#8b7355] font-mono bg-[#f0eae1] px-1.5 py-0.5 rounded">
                      {pipeline.mode}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9a8a77] mt-1">
                  <span>Primary: <strong className="text-[#5c4a32]">{pipeline.primary_llm}</strong></span>
                  {pipeline.computer_vision && (
                    <span>CV: <strong className="text-[#5c4a32]">{pipeline.computer_vision}</strong></span>
                  )}
                  {pipeline.fallback_llm && (
                    <span>Fallback: <strong className="text-[#5c4a32]">{pipeline.fallback_llm}</strong></span>
                  )}
                </div>
              </div>
              <Tag color={pipeline.status === "Active" ? "green" : "orange"} className="!rounded-full !text-[11px] !self-start sm:!self-auto">
                {pipeline.status || "Active"}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
