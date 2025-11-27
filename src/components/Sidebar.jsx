import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CreditCardOutlined,
  FileSearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutAdmin, useAdminProfile } from "../api/api";

const Sidebar = ({ onClick }) => {
  const location = useLocation();
  const { adminProfile } = useAdminProfile();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutAdmin();
    navigate("/login");
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/user-management") return ["user-management"];
    if (path === "/administrators") return ["3"];
    if (path === "/payments") return ["payments"];
    if (path === "/report-managements") return ["report-managements"];
    return ["1"];
  };

  const isSuperAdmin = adminProfile?.user_role === "Super Admin";

  const sidebarItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },

    {
      key: "user-management",
      icon: <UserOutlined />,
      label: <Link to="/user-management">User Management</Link>,
    },

    ...(isSuperAdmin
      ? [
          {
            key: "3",
            icon: <TeamOutlined />,
            label: <Link to="/administrators">Administrators</Link>,
          },
        ]
      : []),

    {
      key: "payments",
      icon: <CreditCardOutlined />,
      label: <Link to="/payments">Payments</Link>,
    },

    {
      key: "report-managements",
      icon: <FileSearchOutlined />,
      label: <Link to="/report-managements">Report Managements</Link>,
    },

    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleSignOut,
      danger: true,
      style: {
        position: "absolute",
        bottom: "85px",
        width: "100%",
      },
    },
  ];

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
      />
    </div>
  );
};

export default Sidebar;
