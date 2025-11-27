import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminProfile } from "../api/api";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const { adminProfile, isLoading, isError } = useAdminProfile({
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) return <Loading />;

  if (isError || !adminProfile) {
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
