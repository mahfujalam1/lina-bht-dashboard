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

const weeklyData = [
  { day: "Mon", scans: 380, users: 240 },
  { day: "Tue", scans: 280, users: 130 },
  { day: "Wed", scans: 220, users: 1000 },
  { day: "Thu", scans: 300, users: 420 },
  { day: "Fri", scans: 180, users: 480 },
  { day: "Sat", scans: 250, users: 380 },
  { day: "Sun", scans: 350, users: 420 },
];

const alerts = [
  {
    dot: "bg-blue-500",
    title: "New Product Added",
    desc: "Ceramide Barrier Cream pending AI sync.",
    time: "2h ago",
  },
  {
    dot: "bg-amber-500",
    title: "High Server Load",
    desc: "Scan API experiencing high traffic.",
    time: "5h ago",
  },
  {
    dot: "bg-green-500",
    title: "Subscription Milestone",
    desc: "Crossed 3,800 active premium users.",
    time: "1d ago",
  },
];

export default function Dashboard() {
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
          value="12,450"
          growth="+12%"
        />
        <StatCard
          icon={<MdOutlineFaceRetouchingNatural />}
          label="Active Scans"
          value="45,900"
          growth="+24%"
        />
        <StatCard
          icon={<FiCreditCard />}
          label="Premium Subs"
          value="3,820"
          growth="+8%"
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Revenue (MRR)"
          value="$114.6k"
          growth="+15%"
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
