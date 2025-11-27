import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { useAdminDashboard, useAdminProfile } from "../../api/api";

function Dashboard() {
  const { adminDashboard, isLoading, isError, error, refetch } =
    useAdminDashboard();

  const { adminProfile } = useAdminProfile();

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div>
      <div className="bg-white w-full p-4 rounded-md">
        <p className="text-[16px] mt-2">Hi, Good Morning</p>
        <h2 className="text-[24px] font-semibold">
          {adminProfile?.first_name
            ? adminProfile?.first_name + " " + adminProfile?.last_name
            : "Admin"}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-md w-full">
          <h1 className="text-[24px] font-semibold">Dashboard Overview</h1>
          <div className="flex justify-between gap-4">
            <div className="mainBG w-full rounded-md p-4">
              <FaUsers className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.total_users || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Users</p>
            </div>
            <div className="mainBG w-full rounded-md p-4">
              <AiOutlineUsergroupAdd className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.total_active_subscribers || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Active Subscribers</p>
            </div>
            <div className="mainBG w-full rounded-md p-4">
              <FaSackDollar className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                ${adminDashboard?.total_earned || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
