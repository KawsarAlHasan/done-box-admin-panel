import React, { useState } from "react";
import { UserOutlined, CameraOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Upload,
  Space,
} from "antd";
import { API } from "../api/api";

const AccountSetting = ({ adminProfile, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setSelectedImage(null);
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleImageSelect = (file) => {
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      if (imageFile) {
        formData.append("photo", imageFile);
      }

      const response = await API.post(
        `/profile/update-primary-profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response, "response");

      message.success("Profile updated successfully!");
      refetch();

      setSelectedImage(null);
      setImageFile(null);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err, "err");
      message.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
      return false;
    }
    return true;
  };

  return (
    <>
      <div
        onClick={showModal}
        className="flex items-center gap-2 px-1 py-2 cursor-pointer"
      >
        <UserOutlined />
        <span>Profile</span>
      </div>

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar
              size={100}
              src={selectedImage || adminProfile?.photo}
              icon={<UserOutlined />}
              className="border-2 border-gray-200"
            />

            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/jpeg,image/png"
              customRequest={({ file, onSuccess }) => {
                onSuccess("ok");
              }}
              onChange={(info) => {
                if (info.file.status === "done") {
                  handleImageSelect(info.file.originFileObj);
                }
              }}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                className="absolute -bottom-1 -right-1 shadow-md"
                style={{ backgroundColor: "#1890ff" }}
              />
            </Upload>
          </div>

          {selectedImage && (
            <p className="text-green-600 text-sm mb-2">
              New image selected. Click "Update Profile" to save changes.
            </p>
          )}
        </div>

        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            first_name: adminProfile?.first_name,
            last_name: adminProfile?.last_name,
            email: adminProfile?.email,
            phone: adminProfile?.phone,
            user_role: adminProfile?.user_role,
          }}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="user_role">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button
              className="my-main-button"
              block
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountSetting;
