import { useState } from "react";
import { Table, Space, Avatar } from "antd";
import { MdBlock } from "react-icons/md";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import ViewUser from "./ViewUser";
import { useAllUsers } from "../../services/userService";

function UserManagement() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [userDetailsData, setUserDetailsData] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { allUsers, pagination, isLoading, isError, error, refetch } =
    useAllUsers(filter);

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setUserDetailsData(null);

    setIsViewModalOpen(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (serial_number) => <span>#{serial_number}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={record?.profile}
            alt={record?.full_name}
            className="!w-[45px] !h-[45px] rounded-full mt-[-5px]"
          />
          <div className="mt-1">
            <h2>{record?.full_name}</h2>
            <p className="text-sm">{record?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span>{phone}</span>,
    },
    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <MdBlock
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => handleUserDetails(record)}
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

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={allUsers}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalUser,
          showSizeChanger: [10, 20, 30, 40],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      <ViewUser
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default UserManagement;
