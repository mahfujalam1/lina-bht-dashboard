import React from "react";
import { Modal, Avatar, Typography, Tag, Descriptions } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROLE_COLOR, STATUS_COLOR } from "../../../page/userManagement/userData";

const { Title, Text } = Typography;

export default function ViewUserModal({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={440}
      centered
      title={
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
          User Details
        </span>
      }
      styles={{
        header: { borderBottom: "1px solid #f3f4f6", paddingBottom: 12 },
      }}
    >
      {/* Profile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 0 20px",
          borderBottom: "1px solid #f3f4f6",
          marginBottom: 20,
        }}
      >
        <Avatar
          src={user.avatar}
          size={72}
          icon={<UserOutlined />}
          style={{ border: "3px solid #e5e7eb", flexShrink: 0 }}
        />
        <div>
          <Title level={4} style={{ margin: 0, color: "#111827" }}>
            {user.name}
          </Title>
          <Text style={{ color: "#6b7280", fontSize: 13 }}>{user.email}</Text>
          <div
            style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}
          >
            <Tag
              color={ROLE_COLOR[user.role]}
              style={{ borderRadius: 20, margin: 0 }}
            >
              {user.role}
            </Tag>
            <Tag
              color={STATUS_COLOR[user.status]}
              style={{ borderRadius: 20, margin: 0 }}
            >
              {user.status}
            </Tag>
          </div>
        </div>
      </div>

      <Descriptions
        column={1}
        size="small"
        labelStyle={{ color: "#6b7280", fontWeight: 500, width: 110 }}
        contentStyle={{ color: "#111827" }}
      >
        <Descriptions.Item label="User ID">{user._id}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={ROLE_COLOR[user.role]}>{user.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={STATUS_COLOR[user.status]}>{user.status}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
