/* eslint-disable react/prop-types */
import { InputNumber, Modal } from "antd";

const endpointNames = {
  face_scan: "Face Scan",
  scalp_scan: "Scalp Scan",
  skin_scan: "Skin Scan",
  product_scan: "Product Scan",
  routine_generate: "Routine Generate",
  lia_chat: "Gixy Chat",
};

export default function EditLimitModal({
  editingLimit,
  limitForm,
  setLimitForm,
  onSave,
  onCancel,
  isLoading,
}) {
  return (
    <Modal
      title={
        <span className="text-[#2d2416] font-semibold text-base">
          Edit {endpointNames[editingLimit?.endpoint_id] || "Endpoint"} Limits
        </span>
      }
      open={Boolean(editingLimit)}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={isLoading}
      okText="Save Limits"
      okButtonProps={{
        className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold",
      }}
      cancelButtonProps={{
        className:
          "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !h-10 !px-5 hover:!bg-[#e8e0d8]",
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
            <label className="text-sm text-[#5c4a32] font-medium mb-1.5 block">
              {label}
            </label>
            <InputNumber
              min={field.toLowerCase().includes("period") ? 1 : 0}
              precision={0}
              value={limitForm[field]}
              onChange={(value) =>
                setLimitForm((current) => ({ ...current, [field]: value }))
              }
              className="!w-full !rounded-xl"
              controls
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
