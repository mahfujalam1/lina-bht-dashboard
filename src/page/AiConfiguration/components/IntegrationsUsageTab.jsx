/* eslint-disable react/prop-types */
import { useState } from "react";
import { Spin, Select } from "antd";
import { TbActivity, TbFlame, TbCoins } from "react-icons/tb";
import { useGetIntegrationsUsageQuery } from "../../../redux/features/integrations/integrationsApi";

const endpointLabels = {
  face_scan: "Face Diagnostic Scan",
  scalp_scan: "Scalp & Hair Analysis",
  skin_scan: "Microscopic Skin Scan",
  product_scan: "Product Safety Scan",
  routine_generate: "Personalized Routine Generation",
  lia_chat: "Gixy Skincare Coach Chat",
};

export default function IntegrationsUsageTab() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useGetIntegrationsUsageQuery({ days });

  const usage = data?.usage;
  const byProvider = usage?.by_provider || {};
  const byEndpoint = usage?.by_endpoint || {};

  return (
    <div className="flex flex-col gap-5">
      {/* Header with lookback filter */}
      <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#2d2416] flex items-center gap-2">
            <TbActivity className="text-[#8b9e7a]" size={18} />
            API Call Volume &amp; Token Consumption
          </h2>
          <p className="text-xs text-[#9a8a77]">
            Attributable requests aggregated from real inference and diagnostic usage logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5c4a32] font-medium">Time Window:</span>
          <Select
            value={days}
            onChange={setDays}
            options={[
              { value: 7, label: "Last 7 Days" },
              { value: 14, label: "Last 14 Days" },
              { value: 30, label: "Last 30 Days (Full TTL)" },
            ]}
            className="!w-44"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-[#eee9e2]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Provider Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* OpenAI */}
            <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b9e7a]">
                  Primary LLM
                </span>
                <h3 className="text-lg font-bold text-[#2d2416] mt-0.5">OpenAI</h3>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-[#9a8a77]">Total Calls</span>
                    <p className="text-xl font-bold text-[#2d2416]">
                      {(byProvider.openai?.calls ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9a8a77]">Tokens Used</span>
                    <p className="text-xl font-bold text-[#5c4a32] flex items-center gap-1">
                      <TbCoins size={16} />
                      {(byProvider.openai?.tokens ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anthropic */}
            <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#a08f7a]">
                  Fallback LLM
                </span>
                <h3 className="text-lg font-bold text-[#2d2416] mt-0.5">Anthropic Claude</h3>
                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-[#9a8a77]">Total Calls</span>
                    <p className="text-xl font-bold text-[#2d2416]">
                      {(byProvider.anthropic?.calls ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9a8a77]">Tokens Used</span>
                    <p className="text-xl font-bold text-[#5c4a32] flex items-center gap-1">
                      <TbCoins size={16} />
                      {(byProvider.anthropic?.tokens ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouCam */}
            <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b38550]">
                  Computer Vision
                </span>
                <h3 className="text-lg font-bold text-[#2d2416] mt-0.5">YouCam S2S</h3>
                <div className="mt-3">
                  <span className="text-[11px] text-[#9a8a77]">Face Scan Calls</span>
                  <p className="text-xl font-bold text-[#2d2416]">
                    {(byProvider.youcam?.calls ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoint Traffic Breakdown Table */}
          <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm">
            <h3 className="text-sm font-semibold text-[#2d2416] mb-3">
              Per-Endpoint Breakdown ({days} Days)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eee9e2] text-[#9a8a77]">
                    <th className="pb-2 font-medium">Endpoint</th>
                    <th className="pb-2 font-medium text-right">Inference Calls</th>
                    <th className="pb-2 font-medium text-right">Tokens Consumed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0eb]">
                  {Object.entries(byEndpoint).map(([ep, stats]) => (
                    <tr key={ep} className="hover:bg-[#fbf9f6]">
                      <td className="py-2.5 font-medium text-[#2d2416]">
                        {endpointLabels[ep] || ep}
                      </td>
                      <td className="py-2.5 text-right font-bold text-[#2d2416]">
                        {(stats.calls ?? 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#5c4a32]">
                        {(stats.tokens ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {Object.keys(byEndpoint).length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[#9a8a77]">
                        No recorded inference calls in the selected window.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
