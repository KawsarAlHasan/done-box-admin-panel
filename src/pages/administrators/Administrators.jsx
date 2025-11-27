import { Avatar, message, Modal, Space, Table } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddAdmin from "./AddAmin";
import AdminEdit from "./AdminEdit";
import { API, useAllAdmins } from "../../api/api";

function Administrators() {
  const { allAdmins, isLoading, isError, error, refetch } = useAllAdmins();

  // 🗑️ delete confirm modal
  const showDeleteConfirm = (adminId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const res = await API.delete(`/users/${adminId}/`);
          console.log(res, "res");
          message.success("Admin deleted successfully!");
          refetch();
        } catch (err) {
          console.log(err, "err");
          message.error(err.response?.data?.error || "Failed to delete admin");
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record, serial_number) => (
        <span className="">#{serial_number + 1}</span>
      ),
    },
    {
      title: <span>Name</span>,
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={record?.photo}
            alt={record?.first_name}
            className="!w-[45px] !h-[45px] rounded-full mt-[-5px]"
          />
          <div className="mt-1">
            <h2>{record?.first_name + " " + record?.last_name}</h2>
          </div>
        </div>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },
    {
      title: <span>Has Access To</span>,
      dataIndex: "user_role",
      key: "user_role",
      render: (user_role) => <span className="">{user_role}</span>,
    },
    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "superadmin";

        return (
          <Space size="middle">
            <AdminEdit adminProfile={record} refetch={refetch} />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record.id)
              }
            />
          </Space>
        );
      },
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  const dataSource = allAdmins?.data || [];

  return (
    <div className="p-4">
      <AddAdmin refetch={refetch} />

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}

export default Administrators;
