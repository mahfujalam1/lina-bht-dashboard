import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FiUsers, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { MdOutlineFaceRetouchingNatural } from "react-icons/md";
import StatCard from "../../component/Main/Dashboard/StatCard";
import { useOverviewQuery } from "../../redux/features/dashboard/dashboardApi";

// Fetch overview data


export default function Dashboard() {
  // Fetch overview data
  const { data, isLoading, error } = useOverviewQuery();

  const weeklyData = data?.weekly_activity?.map(item => ({
    day: item.label,
    scans: item.scans,
    users: item.signups,
  })) || [];

  const alerts = data?.recent_alerts?.map(alert => ({
    dot:
      alert.type === "info"
        ? "bg-blue-500"
        : alert.type === "warning"
        ? "bg-amber-500"
        : alert.type === "success"
        ? "bg-green-500"
        : "bg-gray-500",
    title: alert.title,
    desc: alert.description,
    time: alert.time,
  })) || [];

  const metrics = data?.metrics || {
    total_users: { value: 0, change: "" },
    active_scans: { value: 0, change: "" },
    premium_subs: { value: 0, change: "" },
    revenue: { value: "$0", change: "" },
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><span className="text-gray-500">Loading dashboard...</span></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><span className="text-red-500">Failed to load dashboard data.</span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2d2416] mb-1">
        Dashboard Overview
      </h1>
      <p className="text-sm text-[#9a8a77] mb-7">
        Welcome back. Here's what's happening with Waxi today.
      </p>

      {/* Stat Cards */}
      <div className="flex gap-5 mb-6 flex-wrap">
        <StatCard
          icon={<FiUsers />}
          label="Total Users"
          value={metrics.total_users.value}
          growth={metrics.total_users.change}
        />
        <StatCard
          icon={<MdOutlineFaceRetouchingNatural />}
          label="Active Scans"
          value={metrics.active_scans.value}
          growth={metrics.active_scans.change}
        />
        <StatCard
          icon={<FiCreditCard />}
          label="Premium Subs"
          value={metrics.premium_subs.value}
          growth={metrics.premium_subs.change}
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Revenue (MRR)"
          value={metrics.revenue.value}
          growth={metrics.revenue.change}
        />
      </div>

      {/* Charts + Alerts */}
      <div className="flex gap-5 flex-col xl:flex-row">
        {/* Weekly Activity */}
        <div className="bg-white rounded-2xl p-6 flex-1 shadow-sm">
          <h2 className="text-base font-semibold text-[#2d2416] mb-5">
            Weekly Activity
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} barGap={4} barCategoryGap="30%">
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#9a8a77" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9a8a77" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "#f5f0eb" }}
              />
              <Bar
                dataKey="users"
                fill="#8b9e7a"
                radius={[4, 4, 0, 0]}
                name="Users"
              />
              <Bar
                dataKey="scans"
                fill="#a0845c"
                radius={[4, 4, 0, 0]}
                name="Scans"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl p-6 w-full xl:w-72 shadow-sm">
          <h2 className="text-base font-semibold text-[#2d2416] mb-5">
            Recent Alerts
          </h2>
          <div className="flex flex-col gap-5">
            {alerts.map((alert, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${alert.dot}`}
                />
                <div>
                  <p className="text-sm font-semibold text-[#2d2416]">
                    {alert.title}
                  </p>
                  <p className="text-xs text-[#9a8a77] mt-0.5">{alert.desc}</p>
                  <p className="text-xs text-[#c8bfb0] mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
