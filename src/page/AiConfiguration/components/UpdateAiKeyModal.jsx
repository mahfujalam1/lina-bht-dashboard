/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Input, Select } from "antd";
import { toast } from "sonner";
import { useUpdateApiKeyMutation } from "../../../redux/features/aiConfig/aiConfigApi";

export default function UpdateAiKeyModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [updateApiKey, { isLoading }] = useUpdateApiKeyMutation();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    try {
      const res = await updateApiKey({
        provider,
        api_key: apiKey.trim(),
      }).unwrap();

      toast.success(
        res?.message || `${provider.toUpperCase()} API key verified and updated!`
      );
      if (res?.live_check?.latency_ms) {
        toast.info(`Live test passed with latency: ${res.live_check.latency_ms}ms`);
      }
      setApiKey("");
      onClose();
    } catch (error) {
      toast.error(
        error?.data?.detail || "Failed to verify or update API key. Check key format."
      );
    }
  };

  return (
    <Modal
      title={
        <span className="text-[#2d2416] font-semibold text-base">
          Update LLM API Key
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={isLoading}
      okText="Verify &amp; Save"
      okButtonProps={{
        className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold",
      }}
      cancelButtonProps={{
        className:
          "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !h-10 !px-5 hover:!bg-[#e8e0d8]",
      }}
    >
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-xs text-[#9a8a77]">
          Every key is validated directly against the official provider API before committing to the database. Rejected or inactive keys will not be saved.
        </p>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32] mb-1.5 block">
            Select Provider
          </label>
          <Select
            value={provider}
            onChange={setProvider}
            className="w-full"
            size="large"
            options={[
              { value: "openai", label: "OpenAI (sk-proj-... / sk-...)" },
              { value: "anthropic", label: "Anthropic Claude (sk-ant-...)" },
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32] mb-1.5 block">
            API Key Value
          </label>
          <Input.Password
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              provider === "openai" ? "sk-proj-..." : "sk-ant-api03-..."
            }
            className="!rounded-xl !p-2.5 !bg-[#f7f4f0] !border-[#e8e2d9]"
          />
          <p className="text-[11px] text-[#9a8a77] mt-1.5">
            Key is encrypted in transit and stored safely in the database override store.
          </p>
        </div>
      </div>
    </Modal>
  );
}
