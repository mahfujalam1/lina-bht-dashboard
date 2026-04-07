import React from "react";
import {
  Table,
  Avatar,
  Tag,
  Button,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ROLE_COLOR, STATUS_COLOR } from "./userData";

const { Text } = Typography;

export default function UserTable({ users, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: "SL",
      key: "sl",
      width: 60,
      render: (_, __, index) => (
        <Text style={{ color: "#9ca3af", fontWeight: 600 }}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      ),
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            src={record.avatar}
            size={42}
            icon={<UserOutlined />}
            style={{ border: "2px solid #e5e7eb", flexShrink: 0 }}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#111827",
                fontSize: 14,
                lineHeight: 1.3,
              }}
            >
              {record.name}
            </div>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Text style={{ color: "#4b5563", fontSize: 13 }}>{email}</Text>
      ),
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={ROLE_COLOR[role]}
          style={{ borderRadius: 20, padding: "2px 10px", fontWeight: 500 }}
        >
          {role}
        </Tag>
      ),
      responsive: ["sm"],
      width: 160,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EyeOutlined style={{ fontSize: 16, color: "#6b7280" }} />}
            onClick={() => onView(record)}
            style={{ borderRadius: 8 }}
            title="View"
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: 16, color: "#f59e0b" }} />}
            onClick={() => onEdit(record)}
            style={{ borderRadius: 8 }}
            title="Edit"
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              type="text"
              icon={
                <DeleteOutlined style={{ fontSize: 16, color: "#ef4444" }} />
              }
              style={{ borderRadius: 8 }}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="_id"
      pagination={{ pageSize: 8, size: "small" }}
      scroll={{ x: 600 }}
      size="middle"
      rowClassName="user-table-row"
    />
  );
}
