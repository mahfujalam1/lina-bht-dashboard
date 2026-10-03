/* eslint-disable react/prop-types */
import { Modal, Spin, Tag } from "antd";
import { FaExternalLinkAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useGetIntegrationDetailsQuery } from "../../../redux/features/integrations/integrationsApi";

export default function IntegrationDetailsModal({ providerId, isOpen, onClose }) {
  const { data, isLoading } = useGetIntegrationDetailsQuery(
    { providerId, probe: true },
    { skip: !providerId || !isOpen }
  );

  const integration = data?.integration;
  const health = integration?.health;
  const usage = integration?.usage_30d;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-[#2d2416] font-semibold text-base">
            {integration?.name || "Integration"} Details
          </span>
          {integration?.category && (
            <Tag color="geekblue" className="!rounded-full !text-[11px]">
              {integration.category}
            </Tag>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={640}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : !integration ? (
        <p className="text-xs text-[#9a8a77] py-6">No details available.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-3">
          {/* Description */}
          <p className="text-xs text-[#5c4a32] leading-relaxed">
            {integration.description}
          </p>

          {/* Links & Base URL */}
          <div className="bg-[#f7f4f0] p-3 rounded-xl border border-[#ebe5dc] flex flex-wrap items-center justify-between text-xs gap-2">
            <div>
              <span className="text-[#9a8a77]">Base URL: </span>
              <code className="text-[#2d2416] font-mono font-medium">
                {integration.base_url || "N/A"}
              </code>
            </div>
            {integration.docs_url && (
              <a
                href={integration.docs_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#8b7355] font-semibold hover:underline flex items-center gap-1"
              >
                Official Documentation <FaExternalLinkAlt size={10} />
              </a>
            )}
          </div>

          {/* Live Health Status */}
          {health && (
            <div className="bg-[#fbf9f6] p-3.5 rounded-xl border border-[#eee9e2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32]">
                  Live Connectivity Probe
                </span>
                <Tag
                  color={health.status === "healthy" ? "green" : "red"}
                  className="!rounded-full !px-2.5 !text-[11px] !font-semibold"
                >
                  {health.status === "healthy" ? (
                    <span className="flex items-center gap-1">
                      <FaCheckCircle size={10} /> {health.latency_ms ?? 0}ms Latency
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FaExclamationCircle size={10} /> {health.status}
                    </span>
                  )}
                </Tag>
              </div>
              <p className="text-xs text-[#423321]">{health.detail}</p>
              {health.checked_at && (
                <p className="text-[10px] text-[#9a8a77] mt-1">
                  Checked at: {new Date(health.checked_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Fields & Configuration Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32] mb-2">
              Credentials &amp; Settings
            </h4>
            <div className="flex flex-col gap-2">
              {integration.fields?.map((f) => (
                <div
                  key={f.key}
                  className="bg-[#fdfbf8] p-2.5 rounded-lg border border-[#eee9e2] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#2d2416]">{f.label}</span>{" "}
                    <span className="font-mono text-[#78644e] text-[11px]">({f.key})</span>
                    <p className="font-mono text-[#9a8a77] text-[11px] mt-0.5">
                      Value: {f.value || "(not set)"}
                    </p>
                  </div>
                  <Tag
                    color={
                      f.source === "database"
                        ? "gold"
                        : f.source === "environment"
                        ? "default"
                        : "red"
                    }
                    className="!rounded-md !text-[10px] !m-0"
                  >
                    {f.source === "database"
                      ? "DB Override"
                      : f.source === "environment"
                      ? "Server .env"
                      : "Unset"}
                  </Tag>
                </div>
              ))}
            </div>
          </div>

          {/* 30-Day Usage Summary */}
          {usage && (
            <div className="bg-[#f7f4f0] p-3 rounded-xl border border-[#ebe5dc]">
              <span className="text-xs font-semibold text-[#5c4a32] block mb-1">
                Recent 30-Day Activity
              </span>
              <div className="flex items-center gap-6 text-xs text-[#2d2416]">
                <div>
                  <span className="text-[#9a8a77]">Total Calls: </span>
                  <strong>{(usage.calls ?? 0).toLocaleString()}</strong>
                </div>
                {usage.tokens > 0 && (
                  <div>
                    <span className="text-[#9a8a77]">Tokens Used: </span>
                    <strong>{(usage.tokens ?? 0).toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
