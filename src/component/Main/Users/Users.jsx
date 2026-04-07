import React, { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Tag,
  Avatar,
  Typography,
  Descriptions,
  message,
  Space,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { userDemoData } from "../../../constant/managementData";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Active: "green",
  Inactive: "red",
};

export default function UserManagement() {
  const [users, setUsers] = useState(userDemoData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
    message.success("User deleted successfully");
  };

  const handleView = (record) => {
    setSelectedUser(record);
    setDetailOpen(true);
  };

  const columns = [
    {
      title: "S no.",
      dataIndex: "_id",
      key: "sno",
      render: (id) => (
        <Text className="text-gray-500 font-medium">#{id.split("-")[1]}</Text>
      ),
      width: 100,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            src={record.avatar}
            size={44}
            icon={<UserOutlined />}
            style={{ border: "2px solid #f0f0f0", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{record.phone}</div>
          </div>
        </div>
      ),
      width: 220,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text style={{ color: "#4b5563" }}>{email}</Text>,
      responsive: ["md"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => <Text style={{ color: "#4b5563" }}>{loc}</Text>,
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={STATUS_COLOR[status]}
          style={{ borderRadius: 20, padding: "2px 10px" }}
        >
          {status}
        </Tag>
      ),
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<EyeOutlined style={{ fontSize: 18, color: "#6b7280" }} />}
            onClick={() => handleView(record)}
            style={{ borderRadius: 8 }}
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              type="text"
              icon={
                <DeleteOutlined style={{ fontSize: 18, color: "#ef4444" }} />
              }
              style={{ borderRadius: 8 }}
            />
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={5} style={{ margin: 0, color: "#111827" }}>
          User Management
        </Title>
        <Tag color="purple" style={{ borderRadius: 20 }}>
          {users.length} Users
        </Tag>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{ pageSize: 8, size: "small" }}
        scroll={{ x: 600 }}
        size="middle"
      />

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={520}
        centered
        title={
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
            User Details
          </span>
        }
      >
        {selectedUser && (
          <div>
            {/* Profile Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 0 20px",
                borderBottom: "1px solid #f3f4f6",
                marginBottom: 20,
              }}
            >
              <Avatar
                src={selectedUser.avatar}
                size={72}
                icon={<UserOutlined />}
                style={{ border: "3px solid #e5e7eb" }}
              />
              <div>
                <Title level={4} style={{ margin: 0, color: "#111827" }}>
                  {selectedUser.name}
                </Title>
                <Text style={{ color: "#6b7280" }}>{selectedUser.email}</Text>
                <div style={{ marginTop: 6 }}>
                  <Tag color={STATUS_COLOR[selectedUser.status]}>
                    {selectedUser.status}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <ShoppingCartOutlined
                    style={{ fontSize: 20, color: "#16a34a" }}
                  />
                  <Statistic
                    value={selectedUser.totalOrders}
                    suffix="Orders"
                    valueStyle={{ fontSize: 20, color: "#16a34a" }}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    background: "#eff6ff",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <DollarOutlined style={{ fontSize: 20, color: "#2563eb" }} />
                  <Statistic
                    value={selectedUser.totalSpent}
                    prefix="$"
                    suffix="Spent"
                    valueStyle={{ fontSize: 20, color: "#2563eb" }}
                  />
                </div>
              </Col>
            </Row>

            {/* Info */}
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ color: "#6b7280", fontWeight: 500, width: 120 }}
              contentStyle={{ color: "#111827" }}
            >
              <Descriptions.Item label="User ID">
                {selectedUser._id}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedUser.location}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {selectedUser.joinDate}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
