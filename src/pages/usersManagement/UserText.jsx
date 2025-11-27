import { useState } from "react";
import { Table, Space, Avatar, Tag, Modal, Button, message } from "antd";
import {
  EditOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import ViewUser from "./ViewUser";
import { API, useAllUsers } from "../../api/api";

function UserManagement() {
  const [userDetailsData, setUserDetailsData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { allUsers, isLoading, isError, error, refetch } = useAllUsers();

  // Open status change modal
  const openStatusModal = (record) => {
    setSelectedUser(record);
    setIsStatusModalOpen(true);
  };

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setUserDetailsData(null);
    setIsViewModalOpen(false);
  };

  // Handle delete
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the user. Are you sure?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await API.delete(`/users/${record?.id}/`);

          console.log(res, "res");
          message.success("User deleted successfully");
          refetch();
        } catch (err) {
          message.error(err.response?.data?.message || "Failed to delete user");
          console.error(err, "err");
        }
      },
    });
  };

  // Handle status change
  const handleStatusChange = async () => {
    try {
      const newStatus = selectedUser.status === true ? "Deactive" : "Active";

      const res = await API.post(`/users/${selectedUser.id}/enable-disable/`);

      console.log(res, "res");

      message.success(`Status changed to ${newStatus} successfully`);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to change status");
      console.error(err);
    }
  };

  const columns = [
    {
      title: <span>User ID.</span>,
      dataIndex: "id",
      key: "id",
      render: (id) => <span>#{id}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={record?.photo}
            alt={record?.first_name}
            className="!w-[45px] !h-[45px] rounded-full mt-[-5px]"
          />
          <div className="mt-1">
            <h2>{record?.first_name + " " + record?.last_name}</h2>
            <p className="text-sm">{record?.email}</p>
          </div>
        </div>
      ),
    },

    {
      title: <span>Is Premium</span>,
      dataIndex: "is_premium",
      key: "is_premium",
      render: (_, record) => (
        <span
          className={`${
            record?.is_premium ? "text-green-500" : "text-red-500"
          } font-semibold`}
        >
          {record?.is_premium ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <div className="flex items-center ">
          {is_active === true ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          )}
          <Button
            className="-ml-1"
            title="Status Change"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openStatusModal(record)}
          />
        </div>
      ),
    },
    {
      title: <span>Delete</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <MdBlock
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => handleUserDetails(record)}
          /> */}
          <DeleteFilled
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  const dataSource = allUsers || [];

  console.log(dataSource, "dataSource");

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          total: dataSource.length,
          showSizeChanger: [10, 20, 30, 40],
        }}
        loading={isLoading}
      />

      <ViewUser
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />

      {/* Status Change Modal */}
      <Modal
        title="Change Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to change the status from{" "}
          <strong>
            {selectedUser?.is_active === true ? "Active" : "Deactive"}
          </strong>{" "}
          to{" "}
          <strong>
            {selectedUser?.is_active === true ? "Deactive" : "Active"}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
}

export default UserManagement;
