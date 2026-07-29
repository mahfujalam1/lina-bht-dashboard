/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, InputNumber, Modal, Select, Spin, Tag } from "antd";
import { FaSave, FaSync } from "react-icons/fa";
import { FiActivity, FiEdit2 } from "react-icons/fi";
import { MdOutlineChat } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";
import { toast } from "sonner";
import {
  useCheckModelUpdatesMutation,
  useGetAiConfigQuery,
  useGetEndpointUsageQuery,
  useGetLimitsQuery,
  useSaveAiConfigMutation,
  useUpdateEndpointLimitMutation,
} from "../../redux/features/aiConfig/aiConfigApi";

const endpointNames = {
  face_scan: "Face Scan",
  scalp_scan: "Scalp Scan",
  product_scan: "Product Scan",
  routine_generate: "Routine Generate",
  lia_chat: "Gixy Chat",
};

function LimitCard({ limit, onEdit }) {
  const { data, isLoading } = useGetEndpointUsageQuery(limit.endpoint_id);
  const usage = data?.last_24h;
  const isToken = limit.type === "token";
  const freeLimit = isToken ? limit.free_token_budget : limit.free_max_uses;
  const premiumLimit = isToken
    ? limit.premium_token_budget
    : limit.premium_max_uses;
  const usageValue = isToken ? usage?.total_tokens : usage?.total_calls;

  return (
    <div className="bg-white rounded-xl border border-[#eee9e2] p-4 shadow-[0_2px_10px_rgba(45,36,22,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[#2d2416]">
            {endpointNames[limit.endpoint_id] || limit.endpoint_id}
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-[#a08f7a] mt-0.5">
            {isToken ? "Tokens" : "Requests"}
          </p>
        </div>
        <Button
          type="text"
          aria-label={`Edit ${endpointNames[limit.endpoint_id] || limit.endpoint_id} limits`}
          icon={<FiEdit2 />}
          onClick={() => onEdit(limit)}
          className="!text-[#8b7355] !w-7 !h-7 !min-w-7 hover:!bg-[#f5f0eb]"
        />
      </div>

      <div className="grid grid-cols-2 mt-3 rounded-lg bg-[#f7f4f0]">
        {[
          ["Free", freeLimit, limit.free_period_days],
          ["Premium", premiumLimit, limit.premium_period_days],
        ].map(([plan, value, days]) => (
          <div
            key={plan}
            className="px-3 py-2.5 first:border-r first:border-[#e7e0d7]"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#9a8a77]">
              {plan}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <p className="text-sm font-bold text-[#2d2416]">
                {(value ?? 0).toLocaleString()}
              </p>
              <p className="text-[9px] text-[#9a8a77]">/ {days}d</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[#9a8a77]">
        <FiActivity className="shrink-0 text-[#8b9e7a]" size={13} />
        <span>
          24h usage
          <strong className="text-[#5c4a32] ml-1">
            {isLoading ? "..." : (usageValue ?? 0).toLocaleString()}
          </strong>
          {" / "}
          {usage?.unique_users ?? 0} user{usage?.unique_users === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

export default function AIConfiguration() {
  const { data: configData, isLoading } = useGetAiConfigQuery();
  const { data: limitsData, isLoading: isLoadingLimits } = useGetLimitsQuery();
  const [saveAiConfig, { isLoading: isSaving }] = useSaveAiConfigMutation();
  const [updateEndpointLimit, { isLoading: isUpdatingLimit }] =
    useUpdateEndpointLimitMutation();
  const [checkModelUpdates, { isLoading: isCheckingUpdates }] =
    useCheckModelUpdatesMutation();

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional & Empathetic");
  const [editingLimit, setEditingLimit] = useState(null);
  const [limitForm, setLimitForm] = useState({});

  useEffect(() => {
    if (configData?.config) {
      setPrompt(configData.config.system_prompt_override || "");
      setTone(configData.config.tone || "Professional & Empathetic");
    }
  }, [configData]);

  const handleSave = async () => {
    try {
      const config = configData?.config;
      await saveAiConfig({
        tone,
        system_prompt_override: prompt,
        face_scan_model: config?.face_scan?.name,
        face_scan_accuracy: config?.face_scan?.accuracy,
        face_scan_status: config?.face_scan?.status,
        scalp_hair_model: config?.scalp_hair?.name,
        scalp_hair_accuracy: config?.scalp_hair?.accuracy,
        scalp_hair_status: config?.scalp_hair?.status,
        ingredient_parser_model: config?.ingredient_parser?.name,
        ingredient_parser_accuracy: config?.ingredient_parser?.accuracy,
        ingredient_parser_status: config?.ingredient_parser?.status,
      }).unwrap();
      toast.success("AI Configuration saved successfully!");
    } catch {
      toast.error("Failed to save AI configuration");
    }
  };

  const handleCheckUpdates = async () => {
    try {
      await checkModelUpdates().unwrap();
      toast.success("Successfully checked for model updates!");
    } catch {
      toast.error("Failed to check for updates");
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
        (value) => value === null || value === undefined,
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
      toast.success(`${endpointNames[editingLimit.endpoint_id]} limits updated`);
      setEditingLimit(null);
    } catch (error) {
      toast.error(error?.data?.detail?.[0]?.msg || "Failed to update limits");
    }
  };

  const models = configData?.config
    ? [
        configData.config.face_scan,
        configData.config.scalp_hair,
        configData.config.ingredient_parser,
      ].filter(Boolean)
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            AI Configuration
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage the behavior and tone of the SkinSense AI assistant.
          </p>
        </div>
        <Button
          type="primary"
          icon={<FaSave />}
          loading={isSaving}
          onClick={handleSave}
          className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
        >
          Save Changes
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex gap-5 flex-col lg:flex-row items-start">
          <div className="min-w-0 flex-1 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <MdOutlineChat size={20} className="text-[#8b9e7a]" />
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Personality &amp; Tone
                </h2>
              </div>
              <div className="mb-4">
                <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                  Primary Tone
                </label>
                <Select
                  value={tone}
                  onChange={setTone}
                  className="w-full"
                  size="large"
                  options={[
                    "Professional & Empathetic",
                    "Friendly & Casual",
                    "Clinical & Precise",
                    "Warm & Nurturing",
                  ].map((value) => ({ value, label: value }))}
                />
              </div>
              <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                System Prompt Override
              </label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="w-full bg-[#f5f0eb] text-sm text-[#2d2416] rounded-xl p-4 border-none outline-none resize-none leading-relaxed"
                rows={5}
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <TbSettings2 size={20} className="text-[#8b9e7a]" />
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Diagnostic Models
                </h2>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                {models.map((model) => (
                  <div
                    key={model.name}
                    className="bg-[#f5f0eb] rounded-xl px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#2d2416]">
                        {model.name}
                      </p>
                      <p className="text-xs text-[#9a8a77] mt-0.5">
                        Accuracy: {model.accuracy}
                      </p>
                    </div>
                    <Tag
                      color={model.status === "Active" ? "green" : "orange"}
                      className="!rounded-full !text-xs !font-semibold !px-3 !py-0.5"
                    >
                      {model.status}
                    </Tag>
                  </div>
                ))}
              </div>
              <Button
                icon={<FaSync />}
                loading={isCheckingUpdates}
                onClick={handleCheckUpdates}
                className="flex items-center gap-2 !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !rounded-xl !h-10 !font-medium hover:!bg-[#e8e0d8]"
              >
                Check for Model Updates
              </Button>
            </div>
          </div>

          <aside
            className="w-full flex flex-col gap-3"
            style={{ flex: "0 0 300px", maxWidth: "300px" }}
          >
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-semibold text-[#2d2416]">
                  Usage Limits
                </h2>
                <p className="text-[11px] text-[#9a8a77] mt-0.5">
                  Plan allowances and activity
                </p>
              </div>
              {isLoadingLimits && <Spin size="small" />}
            </div>
            {limitsData?.limits?.map((limit) => (
              <LimitCard
                key={limit.endpoint_id}
                limit={limit}
                onEdit={openLimitModal}
              />
            ))}
            {!isLoadingLimits && !limitsData?.limits?.length && (
              <div className="bg-white rounded-2xl p-5 text-xs text-[#9a8a77] shadow-sm">
                No usage limits are configured.
              </div>
            )}
          </aside>
        </div>
      )}

      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Edit {endpointNames[editingLimit?.endpoint_id] || "Endpoint"} Limits
          </span>
        }
        open={Boolean(editingLimit)}
        onCancel={() => setEditingLimit(null)}
        onOk={handleUpdateLimit}
        confirmLoading={isUpdatingLimit}
        okText="Save Limits"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <div className="grid grid-cols-2 gap-4 mt-5">
          {[
            ["Free limit", "freeValue"],
            ["Free period (days)", "freePeriod"],
            ["Premium limit", "premiumValue"],
            ["Premium period (days)", "premiumPeriod"],
          ].map(([label, field]) => (
            <div key={field}>
              <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                {label}
              </label>
              <InputNumber
                min={field.toLowerCase().includes("period") ? 1 : 0}
                precision={0}
                value={limitForm[field]}
                onChange={(value) =>
                  setLimitForm((current) => ({ ...current, [field]: value }))
                }
                className="!w-full"
                controls
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
