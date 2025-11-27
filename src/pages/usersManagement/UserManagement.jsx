import { useState } from "react";
import {
  Table,
  Space,
  Avatar,
  Tag,
  Modal,
  Button,
  message,
  Card,
  Input,
  DatePicker,
  Tooltip,
  Badge,
  Dropdown,
  Typography,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
  SearchOutlined,
  UserOutlined,
  CrownOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { API, useAllUsers } from "../../api/api";

const { Title, Text } = Typography;

function UserManagement() {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [premiumDate, setPremiumDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const { allUsers, isLoading, isError, error, refetch } = useAllUsers();

  // Filter users based on search
  const filteredUsers = (allUsers || []).filter((user) => {
    const searchLower = searchText.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower)
    );
  });

  // Statistics
  const totalUsers = allUsers?.length || 0;
  const activeUsers = allUsers?.filter((u) => u.is_active)?.length || 0;
  const premiumUsers = allUsers?.filter((u) => u.is_premium)?.length || 0;

  // Open status change modal
  const openStatusModal = (record) => {
    setSelectedUser(record);
    setIsStatusModalOpen(true);
  };

  // Open premium access modal
  const openPremiumModal = (record) => {
    setSelectedUser(record);
    setPremiumDate(
      record.premium_access_til ? dayjs(record.premium_access_til) : null
    );
    setIsPremiumModalOpen(true);
  };

  // Handle delete
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete User",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: (
        <div>
          <p>Are you sure you want to delete this user?</p>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Avatar src={record?.photo} icon={<UserOutlined />} />
              <div>
                <p className="font-medium">
                  {record?.first_name} {record?.last_name}
                </p>
                <p className="text-gray-500 text-sm">{record?.email}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-red-500 text-sm">
            ⚠️ This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await API.delete(`/users/${record?.id}/`);
          message.success("User deleted successfully");
          refetch();
        } catch (err) {
          message.error(err.response?.data?.message || "Failed to delete user");
          console.error(err);
        }
      },
    });
  };

  // Handle status change
  const handleStatusChange = async () => {
    setStatusLoading(true);
    try {
      const newStatus = selectedUser.is_active ? "Inactive" : "Active";
      await API.post(`/users/${selectedUser.id}/enable-disable/`);
      message.success(`User status changed to ${newStatus}`);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to change status");
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle premium access
  const handlePremiumAccess = async () => {
    if (!premiumDate) {
      message.warning("Please select a date for premium access");
      return;
    }

    setPremiumLoading(true);
    try {
      await API.post(`/users/${selectedUser.id}/issue-manual-premium-access/`, {
        premium_access_til: premiumDate.format("YYYY-MM-DDTHH:mm"),
      });
      message.success("Premium access granted successfully");
      setIsPremiumModalOpen(false);
      setPremiumDate(null);
      refetch();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to grant premium access"
      );
      console.error(err);
    } finally {
      setPremiumLoading(false);
    }
  };

  // Action menu items
  const getActionItems = (record) => [
    {
      key: "status",
      label: record.is_active ? "Deactivate User" : "Activate User",
      icon: record.is_active ? <StopOutlined /> : <CheckCircleOutlined />,
      onClick: () => openStatusModal(record),
    },
    {
      key: "premium",
      label: "Manage Premium",
      icon: <CrownOutlined />,
      onClick: () => openPremiumModal(record),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete User",
      icon: <DeleteFilled />,
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

  const columns = [
    {
      title: "User",
      dataIndex: "id",
      key: "user",
      render: (_, record) => (
        <div className="flex gap-3 items-center py-1">
          <Badge
            dot
            status={record?.is_active ? "success" : "default"}
            offset={[-4, 40]}
          >
            <Avatar
              src={record?.photo}
              icon={<UserOutlined />}
              size={48}
              className="border-2 border-gray-100"
            />
          </Badge>
          <div>
            <Text strong className="block text-gray-800">
              {record?.first_name} {record?.last_name}
            </Text>
            <Text type="secondary" className="text-sm">
              {record?.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Premium Status",
      dataIndex: "is_premium",
      key: "is_premium",
      render: (is_premium, record) => (
        <div>
          {is_premium ? (
            <div className="flex items-center gap-2">
              <Tag
                icon={<CrownOutlined />}
                color="gold"
                className="flex items-center"
              >
                Premium
              </Tag>
            </div>
          ) : (
            <Tag color="default">Free</Tag>
          )}
          {record.premium_access_til && (
            <Text type="secondary" className="text-xs block mt-1">
              <CalendarOutlined className="mr-1" />
              Until: {dayjs(record.premium_access_til).format("MMM DD, YYYY")}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <Tag
          icon={is_active ? <CheckCircleOutlined /> : <StopOutlined />}
          color={is_active ? "success" : "error"}
        >
          {is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "last_active",
      key: "last_active",
      render: (last_active) => (
        <Text type="secondary" className="text-sm">
          {last_active
            ? dayjs(last_active).format("MMM DD, YYYY h:mm A")
            : "N/A"}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} className="text-lg" />
        </Dropdown>
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
    <div className="">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Users</Text>}
              value={totalUsers}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Active Users</Text>}
              value={activeUsers}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Premium Users</Text>}
              value={premiumUsers}
              prefix={<CrownOutlined className="text-yellow-500" />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        bordered={false}
        className="shadow-sm"
        title={
          <div className="flex flex-wrap justify-between items-center gap-4 py-2">
            <Text strong className="text-lg">
              All Users
            </Text>
            <div className="flex gap-3">
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-64"
                allowClear
              />
              <Tooltip title="Refresh">
                <Button icon={<ReloadOutlined />} onClick={refetch}>
                  Refresh
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          loading={isLoading}
          className="user-table"
        />
      </Card>

      {/* Status Change Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {selectedUser?.is_active ? (
              <StopOutlined className="text-red-500" />
            ) : (
              <CheckCircleOutlined className="text-green-500" />
            )}
            <span>Change User Status</span>
          </div>
        }
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={statusLoading}
        centered
      >
        <div className="py-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <Avatar
              src={selectedUser?.photo}
              icon={<UserOutlined />}
              size={48}
            />
            <div>
              <Text strong>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Text>
              <Text type="secondary" className="block text-sm">
                {selectedUser?.email}
              </Text>
            </div>
          </div>
          <p>
            Are you sure you want to change the status from{" "}
            <Tag color={selectedUser?.is_active ? "success" : "error"}>
              {selectedUser?.is_active ? "Active" : "Inactive"}
            </Tag>{" "}
            to{" "}
            <Tag color={selectedUser?.is_active ? "error" : "success"}>
              {selectedUser?.is_active ? "Inactive" : "Active"}
            </Tag>
            ?
          </p>
        </div>
      </Modal>

      {/* Premium Access Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CrownOutlined className="text-yellow-500" />
            <span>Manage Premium Access</span>
          </div>
        }
        open={isPremiumModalOpen}
        onOk={handlePremiumAccess}
        onCancel={() => {
          setIsPremiumModalOpen(false);
          setPremiumDate(null);
        }}
        okText="Grant Premium Access"
        cancelText="Cancel"
        confirmLoading={premiumLoading}
        centered
      >
        <div className="py-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <Avatar
              src={selectedUser?.photo}
              icon={<UserOutlined />}
              size={48}
            />
            <div>
              <Text strong>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Text>
              <Text type="secondary" className="block text-sm">
                {selectedUser?.email}
              </Text>
              <div className="mt-1">
                {selectedUser?.is_premium ? (
                  <Tag icon={<CrownOutlined />} color="gold">
                    Premium User
                  </Tag>
                ) : (
                  <Tag color="default">Free User</Tag>
                )}
              </div>
            </div>
          </div>

          {selectedUser?.premium_access_til && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text type="secondary" className="text-sm">
                Current Premium Until:{" "}
                <Text strong className="text-yellow-600">
                  {dayjs(selectedUser.premium_access_til).format(
                    "MMMM DD, YYYY h:mm A"
                  )}
                </Text>
              </Text>
            </div>
          )}

          <div>
            <Text className="block mb-2">
              Select Premium Access Expiry Date:
            </Text>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={premiumDate}
              onChange={(date) => setPremiumDate(date)}
              className="w-full"
              placeholder="Select date and time"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </div>

          {/* Quick Date Options */}
          <div className="mt-4">
            <Text type="secondary" className="text-sm block mb-2">
              Quick Options:
            </Text>
            <Space wrap>
              <Button
                size="small"
                onClick={() => setPremiumDate(dayjs().add(1, "month"))}
              >
                1 Month
              </Button>
              <Button
                size="small"
                onClick={() => setPremiumDate(dayjs().add(3, "month"))}
              >
                3 Months
              </Button>
              <Button
                size="small"
                onClick={() => setPremiumDate(dayjs().add(6, "month"))}
              >
                6 Months
              </Button>
              <Button
                size="small"
                onClick={() => setPremiumDate(dayjs().add(1, "year"))}
              >
                1 Year
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserManagement;
