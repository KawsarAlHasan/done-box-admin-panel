import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BASE_URL = "https://doneboxdevapi.dsrt321.online";
// export const BASE_URL = "http://10.10.7.91:8007";

export const API = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin Profile
export const useAdminProfile = () => {
  const getData = async () => {
    const response = await API.get("/profile/me/");
    return response.data.data;
  };

  const {
    data: adminProfile = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getData,
  });

  return { adminProfile, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// get admin dashboard
export const useAdminDashboard = () => {
  const getData = async () => {
    const response = await API.get("/users/dashboard-overview/");
    return response.data.data;
  };

  const {
    data: adminDashboard = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getData,
  });

  return { adminDashboard, isLoading, isError, error, refetch };
};

// get Payment
export const usePayments = () => {
  const getData = async () => {
    const response = await API.get("/users/payment-data/");
    return response.data.data;
  };

  const {
    data: allPayments = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allPayments"],
    queryFn: getData,
  });

  return { allPayments, isLoading, isError, error, refetch };
};

// get all admin
export const useAllAdmins = () => {
  const getData = async () => {
    const response = await API.get("/users/admin-users/");
    return response.data;
  };

  const {
    data: allAdmins = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allAdmins"],
    queryFn: getData,
  });

  return { allAdmins, isLoading, isError, error, refetch };
};

// get all users
export const useAllUsers = () => {
  const getData = async () => {
    const response = await API.get("/users/");
    return response.data;
  };

  const {
    data: allUsers = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getData,
  });

  return { allUsers, isLoading, isError, error, refetch };
};

// get all report managements
export const useAllReportManagements = ({ type }) => {
  const getData = async () => {
    const response = await API.get("/report-managements/", {
      params: { report_type: type },
    });

    return response.data.data;
  };

  const {
    data: allReport = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allReport", type],
    queryFn: getData,
  });

  return { allReport, isLoading, isError, error, refetch };
};
