import { useState, useEffect } from "react";
import { Select, Button, Progress, Tag, Modal, Input, Spin } from "antd";
import { FaSave, FaKey, FaSync } from "react-icons/fa";
import { MdOutlineChat } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";
import { toast } from "sonner";
import {
  useGetAiConfigQuery,
  useSaveAiConfigMutation,
  useUpdateApiKeyMutation,
  useCheckModelUpdatesMutation,
} from "../../redux/features/aiConfig/aiConfigApi";

export default function AIConfiguration() {
  const { data: configData, isLoading } = useGetAiConfigQuery();
  const [saveAiConfig, { isLoading: isSaving }] = useSaveAiConfigMutation();
  const [updateApiKey, { isLoading: isUpdatingKey }] = useUpdateApiKeyMutation();
  const [checkModelUpdates, { isLoading: isCheckingUpdates }] = useCheckModelUpdatesMutation();

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional & Empathetic");

  const [isApiKeyModalVisible, setIsApiKeyModalVisible] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    if (configData?.config) {
      setPrompt(configData.config.system_prompt_override || "");
      setTone(configData.config.tone || "Professional & Empathetic");
    }
  }, [configData]);

  const handleSave = async () => {
    try {
      const payload = {
        tone,
        system_prompt_override: prompt,
        face_scan_model: configData?.config?.face_scan?.name,
        face_scan_accuracy: configData?.config?.face_scan?.accuracy,
        face_scan_status: configData?.config?.face_scan?.status,
        scalp_hair_model: configData?.config?.scalp_hair?.name,
        scalp_hair_accuracy: configData?.config?.scalp_hair?.accuracy,
        scalp_hair_status: configData?.config?.scalp_hair?.status,
        ingredient_parser_model: configData?.config?.ingredient_parser?.name,
        ingredient_parser_accuracy: configData?.config?.ingredient_parser?.accuracy,
        ingredient_parser_status: configData?.config?.ingredient_parser?.status,
      };
      await saveAiConfig(payload).unwrap();
      toast.success("AI Configuration saved successfully!");
    } catch (error) {
      toast.error("Failed to save AI configuration");
    }
  };

  const handleUpdateApiKey = async () => {
    try {
      await updateApiKey({ api_key: apiKeyInput }).unwrap();
      toast.success("API Key updated successfully!");
      setIsApiKeyModalVisible(false);
      setApiKeyInput("");
    } catch (error) {
      toast.error("Failed to update API key");
    }
  };

  const handleCheckUpdates = async () => {
    try {
      await checkModelUpdates().unwrap();
      toast.success("Successfully checked for model updates!");
    } catch (error) {
      toast.error("Failed to check for updates");
    }
  };

  const models = configData?.config ? [
    configData.config.face_scan,
    configData.config.scalp_hair,
    configData.config.ingredient_parser,
  ].filter(Boolean) : [];

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

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Personality & Tone */}
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
                  {
                    value: "Professional & Empathetic",
                    label: "Professional & Empathetic",
                  },
                  { value: "Friendly & Casual", label: "Friendly & Casual" },
                  { value: "Clinical & Precise", label: "Clinical & Precise" },
                  { value: "Warm & Nurturing", label: "Warm & Nurturing" },
                ]}
                style={{ borderRadius: 12 }}
              />
            </div>

            <div>
              <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                System Prompt Override
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#f5f0eb] text-sm text-[#2d2416] rounded-xl p-4 border-none outline-none resize-none leading-relaxed"
                rows={5}
              />
            </div>
          </div>

          {/* Diagnostic Models */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TbSettings2 size={20} className="text-[#8b9e7a]" />
              <h2 className="text-base font-semibold text-[#2d2416]">
                Diagnostic Models
              </h2>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {models.map((m, i) => (
                <div
                  key={i}
                  className="bg-[#f5f0eb] rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2416]">
                      {m.name}
                    </p>
                    <p className="text-xs text-[#9a8a77] mt-0.5">
                      Accuracy: {m.accuracy}
                    </p>
                  </div>
                  <Tag
                    color={m.status === "Active" ? "green" : "orange"}
                    className="!rounded-full !text-xs !font-semibold !px-3 !py-0.5"
                  >
                    {m.status}
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

        {/* Right Panel */}
        <div className="w-full lg:w-64 flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#2d2416] mb-4">
              API Usage
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9a8a77]">Monthly Quota</span>
              <span className="text-xs font-semibold text-[#2d2416]">{configData?.api_usage?.percentage || 0}%</span>
            </div>
            <Progress
              percent={configData?.api_usage?.percentage || 0}
              showInfo={false}
              strokeColor="#a0845c"
              trailColor="#f0ebe4"
              strokeWidth={8}
            />
            <p className="text-xs text-[#9a8a77] mt-2 mb-4">
              {configData?.api_usage?.requests_used?.toLocaleString()} / {configData?.api_usage?.monthly_quota?.toLocaleString()} requests used
            </p>
            <Button
              icon={<FaKey />}
              onClick={() => setIsApiKeyModalVisible(true)}
              className="w-full flex items-center justify-center gap-2 !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !rounded-xl !h-10 !font-medium hover:!bg-[#e8e0d8]"
            >
              Manage API Keys
            </Button>
            {configData?.api_usage?.api_key_configured && (
              <p className="text-xs text-green-600 mt-3 text-center">
                ✓ API Key configured ({configData.api_usage.masked_api_key})
              </p>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Manage API Keys Modal */}
      <Modal
        title={<span className="text-[#2d2416] font-semibold">Manage API Keys</span>}
        open={isApiKeyModalVisible}
        onCancel={() => setIsApiKeyModalVisible(false)}
        onOk={handleUpdateApiKey}
        confirmLoading={isUpdatingKey}
        okText="Update Key"
        okButtonProps={{ className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl" }}
        cancelButtonProps={{ className: "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]" }}
      >
        <div className="mt-4">
          <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
            New API Key
          </label>
          <Input.Password
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter new API key..."
            className="!rounded-xl !bg-[#f5f0eb] !border-none !py-2"
          />
          <p className="text-xs text-[#9a8a77] mt-2">
            This will update the API key used for external model requests.
          </p>
        </div>
      </Modal>
    </div>
  );
}
