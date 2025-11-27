import React, { useState, useEffect } from "react";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, message, Select } from "antd";
import { API } from "../../api/api";
// import { API } from "../../api/api";

const { Option } = Select;

const AdminEdit = ({ adminProfile, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const normalizeRoleForApi = (role) => {
    if (!role && role !== "") return role;
    return String(role).toLowerCase().replace(/\s+/g, "");
  };

  const displayRoleFromApi = (apiRole) => {
    if (!apiRole && apiRole !== "") return apiRole;
    switch (String(apiRole).toLowerCase()) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      default:
        return String(apiRole)
          .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
          .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    }
  };

  // Whenever adminProfile changes, set form initial values properly.
  useEffect(() => {
    if (adminProfile) {
      const initialRoleValue = normalizeRoleForApi(
        adminProfile.user_role || adminProfile.role
      );
      form.setFieldsValue({
        id: adminProfile.id,
        first_name: adminProfile.first_name,
        last_name: adminProfile.last_name,
        email: adminProfile.email,
        role: initialRoleValue,
      });
    } else {
      form.resetFields();
    }
  }, [adminProfile, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // Ensure role is in the format API expects:
      const apiRole = normalizeRoleForApi(values.role);

      const submitData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: apiRole,
      };

      // uncomment and use your API client
      const res = await API.patch(`/users/${values.id}/`, submitData);

      console.log(res, "res");

      message.success("Admin updated successfully!");
      refetch?.();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.error || "Failed to update Admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditOutlined
        className={`text-[23px] my-main-button p-1 rounded-sm text-white hover:text-blue-300 cursor-pointer`}
        onClick={showModal}
      />

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          {/* Select holds the API-value (e.g. "superadmin") but displays user-friendly label */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role" optionLabelProp="label">
              <Option value="admin" label="Admin">
                Admin
              </Option>
              <Option value="superadmin" label="Super Admin">
                Super Admin
              </Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="my-main-button"
              htmlType="submit"
              loading={loading}
              block
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEdit;
