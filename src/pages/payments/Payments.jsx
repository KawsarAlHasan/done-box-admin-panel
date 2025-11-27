import { useState } from "react";
import { Table, Modal, notification, Avatar } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { usePayments } from "../../api/api";

const { confirm } = Modal;

function Payments() {
  const { allPayments, isLoading, isError, error, refetch } = usePayments();

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: <span>SL No.</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record, serial_number) => (
        <span className="">#{serial_number + 1}</span>
      ),
    },
    {
      title: <span>User</span>,
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={user?.photo}
            alt={user?.first_name + " " + user?.last_name}
            className="!w-[40px] !h-[40px] rounded-full mt-[-5px]"
          />
          <div className="mt-1">
            <h2>{user?.first_name + " " + user?.last_name}</h2>
          </div>
        </div>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "user",
      key: "user",
      render: (user) => <span className="">{user?.email}</span>,
    },

    {
      title: <span>Payments</span>,
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span className="">${amount}</span>,
    },
    {
      title: <span>Date</span>,
      dataIndex: "payment_at",
      key: "payment_at",
      render: (payment_at) => (
        <span className="">{new Date(payment_at).toLocaleString()}</span>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  console.log(allPayments, "allPayments");

  const dataSource = allPayments || [];

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
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  );
}

export default Payments;
