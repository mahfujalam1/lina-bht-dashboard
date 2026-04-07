import React, { useState } from "react";
import { Button, Tag, Typography, message } from "antd";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import UserTable from "./UserTable";
import CreateUserModal from "../../component/ui/Modal/CreateUserModal";
import EditUserModal from "../../component/ui/Modal/EditUserModal";
import ViewUserModal from "../../component/ui/Modal/ViewUserModal";
import { initialUsers } from "./userData";

const { Title } = Typography;

export default function UserManagementMain() {
  const [users, setUsers] = useState(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreate = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdate = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
    );
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
    message.success("User deleted successfully");
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

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
          padding: "14px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#eff6ff",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TeamOutlined style={{ color: "#3b82f6", fontSize: 18 }} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: "#111827" }}>
              User Management
            </Title>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tag
            color="blue"
            style={{ borderRadius: 20, margin: 0, padding: "2px 10px" }}
          >
            {users.length} Users
          </Tag>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
            className="bg-color text-white"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <UserTable
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EditUserModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={handleUpdate}
        user={selectedUser}
      />

      <ViewUserModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
