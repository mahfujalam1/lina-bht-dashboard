import React, { useEffect, useState } from "react";
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
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { ROLES } from "../../../page/userManagement/userData";

const { Text } = Typography;

export default function EditUserModal({ open, onClose, onUpdate, user }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (user && open) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setAvatarUrl(user.avatar || null);
    }
  }, [user, open, form]);

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = (values) => {
    const updated = {
      ...user,
      name: values.name,
      email: values.email,
      role: values.role,
      avatar: avatarUrl,
    };
    onUpdate(updated);
    message.success("User updated successfully!");
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
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
          Edit User
        </span>
      }
      styles={{ header: { borderBottom: "1px solid #f3f4f6", paddingBottom: 12 } }}
    >
      {/* Avatar Upload */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 8px" }}>
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
                background: "#f59e0b",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              <EditOutlined style={{ color: "#fff", fontSize: 11 }} />
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
        Click avatar to change image
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          label={<span style={{ fontWeight: 600, color: "#374151" }}>Full Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter the user's name" }]}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600, color: "#374151" }}>Email Address</span>}
          name="email"
          rules={[
            { required: true, message: "Please enter an email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600, color: "#374151" }}>Role</span>}
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            size="large"
            style={{ borderRadius: 8 }}
            options={ROLES.map((r) => ({ label: r, value: r }))}
          />
        </Form.Item>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Button size="large" onClick={handleCancel} style={{ borderRadius: 8, minWidth: 90 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{ borderRadius: 8, minWidth: 120, background: "#f59e0b", borderColor: "#f59e0b" }}
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
}