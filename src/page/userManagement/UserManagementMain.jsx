import { useState } from "react";
import {
  Table,
  Tag,
  Avatar,
  Input,
  Select,
  Button,
  Modal,
  Popconfirm,
  Descriptions,
  Spin,
  Badge,
} from "antd";
import {
  FiUsers,
  FiSearch,
  FiEye,
  FiTrash2,
  FiSlash,
  FiCheckCircle,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import { toast } from "sonner";
import {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from "../../redux/features/user/userApi";

export default function UserManagementMain() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Fetch real users from MongoDB
  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit,
    search: search.trim(),
    plan: planFilter,
    status: statusFilter,
  });

  // Fetch single user details when modal opens
  const { data: detailData, isLoading: isDetailLoading } = useGetUserDetailsQuery(
    selectedUserId,
    { skip: !selectedUserId }
  );

  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.users || [];
  const total = data?.total || 0;

  // View user details
  const handleView = (user) => {
    setSelectedUserId(user.id);
    setDetailModalOpen(true);
  };

  // Toggle active/suspended
  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus({
        id: user.id,
        is_active: !user.is_active,
      }).unwrap();
      toast.success(
        `User ${user.is_active ? "suspended" : "activated"} successfully.`
      );
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to update user status.");
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User account deleted successfully.");
      if (selectedUserId === userId) {
        setDetailModalOpen(false);
      }
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to delete user.");
    }
  };

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar_url}
            className="!bg-[#a0845c] text-white font-bold flex-shrink-0"
            size={40}
          >
            {record.full_name?.[0]?.toUpperCase() || record.email[0].toUpperCase()}
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-[#2d2416] m-0">
              {record.full_name}
            </p>
            <p className="text-xs text-[#9a8a77] m-0">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => (
        <Tag
          className={`!rounded-full !px-3 !py-0.5 !text-xs !font-semibold ${
            plan === "premium"
              ? "!bg-[#a0845c] !text-white !border-none"
              : "!bg-[#f5f0eb] !text-[#5c4a32] !border-none"
          }`}
        >
          {plan === "premium" ? "★ Premium" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Skin / Hair",
      key: "skin_hair",
      render: (_, record) => (
        <div className="text-xs text-[#5c4a32]">
          <span className="capitalize font-medium">
            {record.skin_type || "Skin: unset"}
          </span>
          {record.hair_type && (
            <span className="text-[#9a8a77]"> • {record.hair_type}</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      render: (isActive) => (
        <Badge
          status={isActive ? "success" : "error"}
          text={
            <span className={`text-xs font-semibold ${isActive ? "text-green-600" : "text-red-500"}`}>
              {isActive ? "Active" : "Suspended"}
            </span>
          }
        />
      ),
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      render: (dt) => (
        <span className="text-xs text-[#9a8a77]">
          {dt ? new Date(dt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="text"
            icon={<FiEye size={15} className="text-[#a0845c]" />}
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={
              record.is_active ? (
                <FiSlash size={15} className="text-amber-600" />
              ) : (
                <FiCheckCircle size={15} className="text-green-600" />
              )
            }
            onClick={() => handleToggleStatus(record)}
            title={record.is_active ? "Suspend User" : "Activate User"}
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to permanently delete this user and their scans?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, className: "!rounded-lg" }}
            cancelButtonProps={{ className: "!rounded-lg" }}
          >
            <Button
              type="text"
              danger
              icon={<FiTrash2 size={15} />}
              title="Delete User"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">User Management</h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            View real mobile users registered in MongoDB, manage account status, and inspect scan activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tag className="!bg-[#f5f0eb] !border-none !text-[#5c4a32] !rounded-full !px-4 !py-1 !text-sm font-semibold">
            {total} Registered Users
          </Tag>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
          <Input
            prefix={<FiSearch className="text-[#9a8a77] mr-1" />}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
            className="!rounded-xl !bg-[#f5f0eb] !border-none !h-10"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            placeholder="Filter by Plan"
            value={planFilter || undefined}
            onChange={(val) => {
              setPlanFilter(val || "");
              setPage(1);
            }}
            allowClear
            className="w-36"
            options={[
              { value: "free", label: "Free Plan" },
              { value: "premium", label: "Premium Plan" },
            ]}
          />
          <Select
            placeholder="Filter by Status"
            value={statusFilter || undefined}
            onChange={(val) => {
              setStatusFilter(val || "");
              setPage(1);
            }}
            allowClear
            className="w-36"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Suspended" },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={isLoading || isFetching}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
          }}
          className="skin-sense-table"
        />
      </div>

      {/* User Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-[#2d2416] font-semibold">
            <FiShield className="text-[#a0845c]" />
            User Details
          </div>
        }
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedUserId(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedUserId(null);
            }}
            className="!rounded-xl !bg-[#f5f0eb] !border-none !text-[#5c4a32]"
          >
            Close
          </Button>,
        ]}
        width={650}
      >
        {isDetailLoading || !detailData?.user ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 p-4 bg-[#f5f0eb] rounded-2xl">
              <Avatar
                src={detailData.user.avatar_url}
                size={54}
                className="!bg-[#a0845c] text-white font-bold"
              >
                {detailData.user.full_name?.[0]?.toUpperCase() ||
                  detailData.user.email[0].toUpperCase()}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#2d2416] m-0">
                    {detailData.user.full_name}
                  </h3>
                  <Tag
                    className={`!rounded-full !text-xs !font-semibold ${
                      detailData.user.plan === "premium"
                        ? "!bg-[#a0845c] !text-white !border-none"
                        : "!bg-white !text-[#5c4a32] !border-none"
                    }`}
                  >
                    {detailData.user.plan === "premium" ? "★ Premium" : "Free"}
                  </Tag>
                </div>
                <p className="text-xs text-[#9a8a77] m-0 mt-0.5">
                  {detailData.user.email}
                </p>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-[#9a8a77] block">Total Scans</span>
                <span className="text-lg font-bold text-[#2d2416]">
                  {detailData.stats?.total_scans || 0}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-[#9a8a77] block">Face Scans</span>
                <span className="text-lg font-bold text-[#2d2416]">
                  {detailData.stats?.face_scans || 0}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-[#9a8a77] block">Hair Scans</span>
                <span className="text-lg font-bold text-[#2d2416]">
                  {detailData.stats?.hair_scans || 0}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-[#9a8a77] block">Routines</span>
                <span className="text-lg font-bold text-[#2d2416]">
                  {detailData.stats?.routines_count || 0}
                </span>
              </div>
            </div>

            {/* Profile Fields */}
            <Descriptions column={2} size="small" bordered className="rounded-xl overflow-hidden">
              <Descriptions.Item label="Skin Type">
                <span className="capitalize font-semibold text-[#2d2416]">
                  {detailData.user.skin_type || "Not set"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Hair Type">
                <span className="capitalize font-semibold text-[#2d2416]">
                  {detailData.user.hair_type || "Not set"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Skin Concerns" span={2}>
                {detailData.user.skin_concerns?.length > 0 ? (
                  detailData.user.skin_concerns.map((c) => (
                    <Tag key={c} className="!rounded-full !bg-[#f5f0eb] !border-none !text-[#5c4a32] !text-xs">
                      {c}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-400">None specified</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Account Status">
                <span className={detailData.user.is_active ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                  {detailData.user.is_active ? "Active" : "Suspended"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Registered At">
                <span className="text-[#5c4a32]">
                  {detailData.user.created_at
                    ? new Date(detailData.user.created_at).toLocaleString()
                    : "—"}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {/* Subscription Info if Available */}
            {detailData.subscription && (
              <div className="p-4 bg-[#fbf9f6] rounded-2xl border border-[#ede5db]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a0845c] mb-2">
                  Active Subscription
                </h4>
                <div className="flex items-center justify-between text-xs text-[#5c4a32]">
                  <span>
                    Billing: <strong>{detailData.subscription.plan_type}</strong>
                  </span>
                  <span>
                    Status: <strong className="capitalize">{detailData.subscription.status}</strong>
                  </span>
                  <span>
                    Expires:{" "}
                    <strong>
                      {detailData.subscription.expires_at
                        ? new Date(detailData.subscription.expires_at).toLocaleDateString()
                        : "Never"}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
