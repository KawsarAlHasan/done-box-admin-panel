import { useState } from "react";
import { Avatar, Radio, Table } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { useAllReportManagements } from "../../api/api";

function ReportManagements() {
  const [type, setType] = useState("bug");

  const { allReport, isLoading, isError, error, refetch } =
    useAllReportManagements({ type });

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  const dataSource = allReport || [];

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const columns = [
    {
      title: <span>User</span>,
      key: "user",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar
            src={record?.created_by?.photo}
            alt={record?.created_by?.first_name}
            className="!w-[45px] !h-[45px] rounded-full mt-[-5px]"
          />
          <div className="mt-1">
            <h2>
              {record?.created_by?.first_name +
                " " +
                record?.created_by?.last_name}
            </h2>
            <p className="text-sm">{record?.created_by?.email}</p>
          </div>
        </div>
      ),
    },

    {
      title: <span>{type === "bug" ? "Bug" : "Support"}</span>,
      dataIndex: "description",
      key: "description",
      render: (description) => {
        const short =
          description.length > 60
            ? description.substring(0, 60) + "..."
            : description;

        return <span title={description}>{short}</span>;
      },
    },

    {
      title: <span>Date</span>,
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => (
        <span>{new Date(created_at).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Radio.Group
          value={type}
          buttonStyle="solid"
          onChange={handleTypeChange}
        >
          <Radio.Button value="bug">Bug</Radio.Button>
          <Radio.Button value="support">Support</Radio.Button>
        </Radio.Group>
      </div>

      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            total: dataSource.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "40"],
          }}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default ReportManagements;
