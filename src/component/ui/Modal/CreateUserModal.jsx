import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Avatar,
  Typography,
  message,
} from "antd";
import { UserOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { ROLES } from "../../../page/userManagement/userData";

const { Text } = Typography;

export default function CreateUserModal({ open, onClose, onCreate }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = (values) => {
    const newUser = {
      _id: `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      role: values.role,
      avatar: avatarUrl || `https://i.pravatar.cc/150?u=${values.email}`,
      status: "Active",
    };
    onCreate(newUser);
    form.resetFields();
    setAvatarUrl(null);
    message.success("User created successfully!");
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarUrl(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={480}
      centered
      title={
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
          Add New User
        </span>
      }
      styles={{
        header: { borderBottom: "1px solid #f3f4f6", paddingBottom: 12 },
      }}
    >
      {/* Avatar Upload */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px 0 8px",
        }}
      >
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleAvatarChange}
          accept="image/*"
        >
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Avatar
              src={avatarUrl}
              size={80}
              icon={<UserOutlined />}
              style={{ border: "3px solid #e5e7eb", background: "#f3f4f6" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#3b82f6",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              <PlusOutlined style={{ color: "#fff", fontSize: 12 }} />
            </div>
          </div>
        </Upload>
      </div>
      <Text
        style={{
          display: "block",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: 12,
          marginBottom: 20,
        }}
      >
        Click avatar to upload image
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>Full Name</span>
          }
          name="name"
          rules={[{ required: true, message: "Please enter the user's name" }]}
        >
          <Input
            placeholder="e.g. Arif Hossain"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Email Address
            </span>
          }
          name="email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            placeholder="e.g. arif@example.com"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>Role</span>
          }
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder="Select a role"
            size="large"
            style={{ borderRadius: 8 }}
            options={ROLES.map((r) => ({ label: r, value: r }))}
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <Button
            size="large"
            onClick={handleCancel}
            style={{ borderRadius: 8, minWidth: 90 }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            htmlType="submit"
            className="bg-color text-white"
          >
            Create User
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
