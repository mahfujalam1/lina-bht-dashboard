/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Checkbox, Button, Tooltip } from "antd";
import { toast } from "sonner";
import { FaUndo } from "react-icons/fa";
import {
  useUpdateIntegrationCredentialsMutation,
  useClearIntegrationCredentialMutation,
} from "../../../redux/features/integrations/integrationsApi";

export default function EditCredentialModal({ provider, isOpen, onClose }) {
  const [values, setValues] = useState({});
  const [verify, setVerify] = useState(true);

  const [updateCredentials, { isLoading: isUpdating }] =
    useUpdateIntegrationCredentialsMutation();
  const [clearCredential, { isLoading: isClearing }] =
    useClearIntegrationCredentialMutation();

  useEffect(() => {
    if (provider?.fields) {
      const initial = {};
      provider.fields
        .filter((f) => f.editable)
        .forEach((f) => {
          initial[f.key] = "";
        });
      setValues(initial);
    }
  }, [provider]);

  if (!provider) return null;

  const editableFields = provider.fields?.filter((f) => f.editable) || [];

  const handleSave = async () => {
    const payload = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v && v.trim()) {
        payload[k] = v.trim();
      }
    });

    if (Object.keys(payload).length === 0) {
      toast.error("Please provide at least one credential value to update");
      return;
    }

    try {
      const res = await updateCredentials({
        providerId: provider.id,
        values: payload,
        verify,
      }).unwrap();

      toast.success(res.message || `${provider.name} credentials updated!`);
      if (res.verified) {
        toast.info("Live verification passed successfully!");
      }
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.detail || err?.message || "Failed to update credentials."
      );
    }
  };

  const handleResetToEnv = async (key) => {
    try {
      const res = await clearCredential({
        providerId: provider.id,
        key,
      }).unwrap();
      toast.success(res.message || `Reset ${key} to server .env`);
      setValues((prev) => ({ ...prev, [key]: "" }));
    } catch (err) {
      toast.error(err?.data?.detail || `Failed to reset ${key}`);
    }
  };

  return (
    <Modal
      title={
        <span className="text-[#2d2416] font-semibold text-base">
          Configure {provider.name} Credentials
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={isUpdating}
      okText="Save &amp; Apply"
      okButtonProps={{
        className:
          "!bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold",
      }}
      cancelButtonProps={{
        className:
          "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !h-10 !px-5 hover:!bg-[#e8e0d8]",
      }}
    >
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-xs text-[#8a7662]">
          Settings saved here take effect across all workers within 30 seconds.
          Values entered will override the server&apos;s <code>.env</code> file.
        </p>

        {editableFields.map((field) => {
          const isDatabaseSource = field.source === "database";

          return (
            <div
              key={field.key}
              className="bg-[#f7f4f0] p-3.5 rounded-xl border border-[#e8dfd3]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#453724]">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#9a8a77]">
                    Current:{" "}
                    <code className="text-[#695844]">
                      {field.value || "(not set)"}
                    </code>
                  </span>
                  {isDatabaseSource && (
                    <Tooltip title="Clear database override and revert to server .env value">
                      <Button
                        size="small"
                        type="text"
                        loading={isClearing}
                        icon={<FaUndo size={10} />}
                        onClick={() => handleResetToEnv(field.key)}
                        className="!text-[#a85a2a] !h-6 !px-1.5 !text-[10px] hover:!bg-[#f0e6dc]"
                      >
                        Reset to .env
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>

              {field.secret ? (
                <Input.Password
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder || "Enter new key..."}
                  className="!rounded-lg !bg-white !border-[#d6cbbe]"
                />
              ) : (
                <Input
                  value={values[field.key] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder || "Enter value..."}
                  className="!rounded-lg !bg-white !border-[#d6cbbe]"
                />
              )}

              {field.help && (
                <p className="text-[10px] text-[#9a8a77] mt-1">{field.help}</p>
              )}
            </div>
          );
        })}

        <div className="pt-2">
          <Checkbox
            checked={verify}
            onChange={(e) => setVerify(e.target.checked)}
            className="text-xs text-[#5c4a32]"
          >
            <span className="font-medium text-xs text-[#453724]">
              Live verify credentials with {provider.name} before saving
            </span>
          </Checkbox>
          <p className="text-[10px] text-[#9a8a77] ml-6 mt-0.5">
            Recommended: Prevents invalid credentials from breaking live production features.
          </p>
        </div>
      </div>
    </Modal>
  );
}
