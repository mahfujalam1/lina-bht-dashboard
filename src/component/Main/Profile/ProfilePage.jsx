import React, { useEffect, useState } from "react";
import { Card, Input, Button, Avatar, Form, Upload } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, CameraOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useChangePasswordMutation, useMeQuery } from "../../../redux/features/auth/authApi";
import { useUdpateMyProfileMutation } from "../../../redux/features/user/userApi";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { data } = useMeQuery();
  const [changePassword] = useChangePasswordMutation();
  const [updateProfile] = useUdpateMyProfileMutation();
  const userData = data?.admin;
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  }
  const [form] = Form.useForm();

  const handleImageChange = (info) => {
    // If using dummy upload (beforeUpload={() => false}), info.file is the file itself.
    const file = info.file;
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        full_name: userData?.full_name,
      });
    }
  }, [userData, form]);

  // Handle profile update form submission
  const handleUpdateProfile = async (values) => {
    try {
      // Remove email from values before sending to the API
      const { email, ...profileData } = values;

      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key]) {
          formData.append(key, profileData[key]);
        }
      });

      if (imageFile) {
        formData.append("avatar", imageFile); // Assumed backend expects "image". Change if necessary.
      }

      // Call API with updated data excluding email
      const res = await updateProfile(formData).unwrap();
      toast.success(res?.message || "Profile updated successfully"); // Show success message
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile"); // Show error message
    }
  };

  // Handle password change form submission
  const handlePasswordChange = async (values) => {
    const { previousPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match"); // Show error if passwords don't match
      return;
    }
    try {
      await changePassword({ current_password: previousPassword, new_password: newPassword }).unwrap();
      toast.success("Password changed successfully"); // Show success message
    } catch (error) {
      toast.error("Failed to change password"); // Show error message
    }
  };

  const renderForm = () => {
    if (activeTab === "editProfile") {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Edit Your Profile
          </h3>
          <div className="space-y-4">
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="User Name" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  className="bg-color"
                >
                  Save & Update
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-md mx-auto">
          <h3 className="text-center mb-6 font-medium text-gray-700 text-lg">
            Change Your Password
          </h3>
          <div className="space-y-4">
            <Form onFinish={handlePasswordChange} layout="vertical">
              <Form.Item
                name="previousPassword"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Current Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                ]}
              >
                <Input.Password
                  placeholder="New Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Confirm New Password"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="bg-color"
                  block
                >
                  Send & Change
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl p-8 border-none shadow-none">
        <div className="flex flex-col items-center">
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <div className="relative cursor-pointer group">
              <Avatar
                size={100}
                src={previewImage || userData?.avatar_url || userData?.image || "https://i.pravatar.cc/150?img=3"}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraOutlined className="text-white text-2xl" />
              </div>
            </div>
          </Upload>
          <h2 className="mt-3 text-xl font-semibold">{userData?.full_name}</h2>

          {/* Tabs below image */}
          <div className="mt-6 flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("editProfile")}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === "editProfile"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
                }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === "changePassword"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
                }`}
            >
              Change Password
            </button>
          </div>

          <div className="mt-8 w-full">{renderForm()}</div>
        </div>
      </Card>
    </div>
  );
}
