/* eslint-disable react/prop-types */
import { Modal, Spin, Table, Tag } from "antd";
import { useGetIntegrationsAuditQuery } from "../../../redux/features/integrations/integrationsApi";

export default function IntegrationAuditModal({ isOpen, onClose }) {
  const { data, isLoading } = useGetIntegrationsAuditQuery(
    { limit: 50 },
    { skip: !isOpen }
  );

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
      render: (val) => (
        <span className="text-xs text-[#5c4a32]">
          {val ? new Date(val).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      title: "Admin",
      dataIndex: "admin_email",
      key: "admin_email",
      width: 180,
      render: (val, record) => (
        <span className="text-xs font-medium text-[#2d2416]">
          {val || record.admin_id || "System"}
        </span>
      ),
    },
    {
      title: "Modified Keys",
      dataIndex: "keys",
      key: "keys",
      render: (keys) =>
        keys && keys.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {keys.map((k) => (
              <Tag key={k} color="blue" className="!rounded !font-mono !text-[10px]">
                {k}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-[#9a8a77]">None</span>
        ),
    },
    {
      title: "Cleared (Reverted to .env)",
      dataIndex: "cleared",
      key: "cleared",
      render: (cleared) =>
        cleared && cleared.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {cleared.map((k) => (
              <Tag key={k} color="volcano" className="!rounded !font-mono !text-[10px]">
                {k}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-[#9a8a77]">None</span>
        ),
    },
  ];

  return (
    <Modal
      title={
        <span className="text-[#2d2416] font-semibold text-base">
          Credential Change Audit Log
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={780}
    >
      <p className="text-xs text-[#9a8a77] mb-3">
        Records every credential modification or reset action. Secret values are never logged to protect security.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={data?.entries?.map((item, index) => ({
            ...item,
            key: index,
          })) || []}
          columns={columns}
          pagination={{ pageSize: 8, size: "small" }}
          className="border border-[#eee9e2] rounded-xl overflow-hidden"
          size="small"
        />
      )}
    </Modal>
  );
}
