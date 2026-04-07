import React, { useState } from "react";
import { Modal, Button, Tag, Typography, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Pending: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Approved: { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" },
  Rejected: { color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
};

export default function ProductDetailModal({
  open,
  onClose,
  product,
  onApprove,
  onReject,
}) {
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const statusStyle = STATUS_COLOR[product.status];

  const handleApprove = () => {
    onApprove(product._id);
    onClose();
  };

  const handleReject = () => {
    onReject(product._id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      styles={{
        content: { padding: 0, borderRadius: 16, overflow: "hidden" },
        header: { display: "none" },
        body: { padding: 0 },
      }}
    >
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Image Gallery */}
        <div style={{ background: "#f8f8f8", padding: "24px 24px 16px" }}>
          {/* Thumbnails */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {product.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImg(i)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  border:
                    activeImg === i
                      ? "2px solid #111"
                      : "2px solid transparent",
                  transition: "border 0.2s",
                  flexShrink: 0,
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/72x72?text=IMG";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div
            style={{
              width: "100%",
              height: 200,
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={product.images[activeImg]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/480x200?text=Product+Image";
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Name + Price */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Title
              level={4}
              style={{
                margin: 0,
                color: "#111827",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              {product.name}
            </Title>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#f59e0b",
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
                marginLeft: 12,
              }}
            >
              ${product.price.toLocaleString()}
            </span>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}`,
              }}
            >
              {product.status}
            </span>
          </div>

          {/* Info rows */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 16px",
              marginBottom: 14,
            }}
          >
            <InfoRow label="Brand" value={product.brand} />
            <InfoRow label="Category" value={product.category} />
            <InfoRow label="Quantity" value={product.quantity} />
            <InfoRow label="Sub Category" value={product.subCategory} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <InfoRow
              label="Available Sizes"
              value={`(e.g., ${product.availableSizes})`}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Description
            </Text>
            <Text
              style={{
                display: "block",
                marginTop: 4,
                color: "#374151",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {product.description}
            </Text>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <Popconfirm
              title="Approve Product"
              description="Confirm approval for this product?"
              onConfirm={handleApprove}
              okText="Approve"
              cancelText="Cancel"
              okButtonProps={{
                style: { background: "#10b981", borderColor: "#10b981" },
              }}
              disabled={product.status === "Approved"}
            >
              <Button
                icon={<CheckOutlined />}
                disabled={product.status === "Approved"}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  background:
                    product.status === "Approved" ? "#d1fae5" : "#ecfdf5",
                  color: product.status === "Approved" ? "#6ee7b7" : "#10b981",
                  border: `1px solid ${product.status === "Approved" ? "#a7f3d0" : "#6ee7b7"}`,
                  cursor:
                    product.status === "Approved" ? "not-allowed" : "pointer",
                }}
              >
                Approve
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Reject Product"
              description="Are you sure you want to reject this product?"
              onConfirm={handleReject}
              okText="Yes, Reject"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              disabled={product.status === "Rejected"}
            >
              <Button
                icon={<CloseOutlined />}
                disabled={product.status === "Rejected"}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  background:
                    product.status === "Rejected" ? "#fee2e2" : "#fef2f2",
                  color: product.status === "Rejected" ? "#fca5a5" : "#ef4444",
                  border: `1px solid ${product.status === "Rejected" ? "#fca5a5" : "#fca5a5"}`,
                  cursor:
                    product.status === "Rejected" ? "not-allowed" : "pointer",
                }}
              >
                Reject
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
        {label}:{" "}
      </Text>
      <Text style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
        {value}
      </Text>
    </div>
  );
}
