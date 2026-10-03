/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Tag, Tooltip } from "antd";
import { FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt, FaPlay, FaEdit, FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useTestSingleIntegrationMutation } from "../../../redux/features/integrations/integrationsApi";

export default function IntegrationCard({
  provider,
  onEdit,
  onViewDetails,
}) {
  const [testIntegration, { isLoading: isTesting }] = useTestSingleIntegrationMutation();
  const [localHealth, setLocalHealth] = useState(provider.health || null);

  const handleTest = async () => {
    try {
      const res = await testIntegration(provider.id).unwrap();
      setLocalHealth(res.health);
      if (res.health?.status === "healthy") {
        toast.success(`${provider.name} is healthy! (${res.health.latency_ms ?? 0}ms)`);
      } else {
        toast.error(`${provider.name} status: ${res.health?.detail || "unhealthy"}`);
      }
    } catch (err) {
      toast.error(err?.data?.detail || `Failed to test ${provider.name}`);
    }
  };

  const health = localHealth || provider.health;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#eee9e2] shadow-sm flex flex-col justify-between transition-all hover:border-[#ded5c7]">
      <div>
        {/* Header: Name + Category + Health Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-sm font-bold text-[#2d2416] flex items-center gap-2">
              {provider.name}
              {provider.editable && (
                <span className="text-[10px] font-semibold text-[#8b7355] bg-[#f7f2ea] px-2 py-0.5 rounded-full border border-[#e8ded0]">
                  Editable
                </span>
              )}
            </h3>
            <span className="text-[11px] font-medium text-[#9a8a77]">
              {provider.category}
            </span>
          </div>

          <div>
            {health ? (
              <Tag
                color={
                  health.status === "healthy"
                    ? "green"
                    : health.status === "not_configured"
                    ? "default"
                    : "red"
                }
                className="!rounded-full !px-2.5 !py-0.5 !text-[11px] !font-semibold !m-0"
              >
                {health.status === "healthy" ? (
                  <span className="flex items-center gap-1">
                    <FaCheckCircle size={10} /> {health.latency_ms != null ? `${health.latency_ms}ms` : "Healthy"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <FaExclamationCircle size={10} /> {health.status}
                  </span>
                )}
              </Tag>
            ) : (
              <Tag
                color={provider.configured ? "blue" : "orange"}
                className="!rounded-full !px-2.5 !py-0.5 !text-[11px] !font-semibold !m-0"
              >
                {provider.configured ? "Configured" : "Incomplete"}
              </Tag>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#705e49] leading-relaxed mb-3 line-clamp-2">
          {provider.description}
        </p>

        {/* Health detail note if tested */}
        {health?.detail && (
          <div className="bg-[#f9f7f4] border border-[#ebe5dc] rounded-lg px-2.5 py-1.5 text-[11px] text-[#6b5842] mb-3">
            <span className="font-medium text-[#9a8a77]">Status note: </span>
            {health.detail}
          </div>
        )}

        {/* Fields / Credentials list */}
        <div className="bg-[#f7f4f0] rounded-xl p-3 border border-[#ebe5dc] mb-3 flex flex-col gap-2">
          {provider.fields?.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between text-[11px] gap-2"
            >
              <div className="truncate min-w-0">
                <span className="font-medium text-[#5c4a32]">{field.label}:</span>{" "}
                <span className="font-mono text-[#8a7a67]">
                  {field.value || "(not set)"}
                </span>
              </div>
              <Tooltip title={`Source: ${field.source}`}>
                <span
                  className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                    field.source === "database"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : field.source === "environment"
                      ? "bg-slate-100 text-slate-700 border border-slate-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {field.source === "database" ? "DB Override" : field.source === "environment" ? ".env" : "Unset"}
                </span>
              </Tooltip>
            </div>
          ))}
        </div>

        {/* Feature tags */}
        {provider.used_by?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {provider.used_by.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-[10px] text-[#85725d] bg-[#f5f0eb] px-2 py-0.5 rounded-md"
              >
                {feature}
              </span>
            ))}
            {provider.used_by.length > 3 && (
              <span className="text-[10px] text-[#9a8a77] px-1 py-0.5">
                +{provider.used_by.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#eee9e2] gap-2">
        <div className="flex items-center gap-1.5">
          {provider.testable && (
            <Button
              size="small"
              icon={<FaPlay size={9} />}
              loading={isTesting}
              onClick={handleTest}
              className="flex items-center gap-1 !bg-[#f5f0eb] !border-[#e7e0d7] !text-[#5c4a32] !rounded-lg !h-7 !px-2.5 !text-[11px] hover:!bg-[#e8e0d8]"
            >
              Test
            </Button>
          )}

          {provider.editable && (
            <Button
              size="small"
              icon={<FaEdit size={10} />}
              onClick={() => onEdit(provider)}
              className="flex items-center gap-1 !bg-[#2d2416] !border-[#2d2416] !text-white !rounded-lg !h-7 !px-2.5 !text-[11px] hover:!bg-[#453724]"
            >
              Configure
            </Button>
          )}
        </div>

        <Button
          type="text"
          size="small"
          icon={<FaInfoCircle size={12} />}
          onClick={() => onViewDetails(provider)}
          className="!text-[#8b7355] hover:!bg-[#f5f0eb] !rounded-lg !h-7 !px-2 !text-[11px]"
        >
          Details
        </Button>
      </div>
    </div>
  );
}
