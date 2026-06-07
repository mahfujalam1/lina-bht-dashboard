import { useRef, useState } from "react";
import { Button, Select, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { FaFilter, FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useGetUserDashboardQuery, useGetUsersAnalyticsQuery } from "../../redux/features/analytics/analyticsApi";

const COLORS = ["#a0845c", "#8b9e7a", "#5c4a32", "#e8d8c4", "#c4a37a", "#d4b382", "#b38f62", "#9a8a77"];

const mapWithColors = (data) => (data || []).map((item, index) => ({
  ...item,
  value: item.percent,
  color: COLORS[index % COLORS.length]
}));

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Analytics() {
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [ageGroup, setAgeGroup] = useState("all");
  const [gender, setGender] = useState("all");

  const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardQuery({
    period: dateRange,
    age_group: ageGroup,
    gender: gender
  });

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersAnalyticsQuery();

  const isLoading = isDashboardLoading || isUsersLoading;

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `analytics-report-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(reportRef.current).save();
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">User Analytics</h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Analyze user demographics, skin concerns, and engagement trends.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select
            value={dateRange}
            onChange={setDateRange}
            className="w-40"
            options={dashboardData?.filter_options?.periods || [
              { value: "last_30_days", label: "Last 30 Days" }
            ]}
          />
          <Select
            value={ageGroup}
            onChange={setAgeGroup}
            className="w-36"
            options={dashboardData?.filter_options?.age_groups || [
              { value: "all", label: "All Ages" }
            ]}
          />
          <Select
            value={gender}
            onChange={setGender}
            className="w-36"
            options={dashboardData?.filter_options?.genders || [
              { value: "all", label: "All Genders" }
            ]}
          />
          <Button
            type="primary"
            icon={<FaDownload />}
            loading={exporting}
            onClick={handleExportPDF}
            className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
          >
            {exporting ? "Exporting..." : "Export Report"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div ref={reportRef}>
          {/* Filter summary bar */}
          <div className="bg-white rounded-2xl px-5 py-3 shadow-sm mb-5 flex items-center gap-4 flex-wrap">
            <span className="text-xs font-semibold text-[#9a8a77] uppercase tracking-wide">
              Filters Applied:
            </span>
            <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
              {dashboardData?.filters?.period_label || dateRange}
            </span>
            <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
              {dashboardData?.filters?.age_group_label || ageGroup}
            </span>
            <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
              {dashboardData?.filters?.gender_label || gender}
            </span>
            <div className="ml-auto flex gap-4 text-sm text-[#5c4a32]">
              <span><strong>Total Users:</strong> {usersData?.total_users || 0}</span>
              <span><strong>With Profile:</strong> {usersData?.users_with_profile || 0}</span>
            </div>
          </div>

          <div className="flex gap-5 flex-col lg:flex-row mb-5">
            {/* Top Skin Concerns */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🔍</span>
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Top Skin Concerns
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={dashboardData?.top_skin_concerns || []}
                  layout="vertical"
                  barCategoryGap="25%"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9a8a77" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#5c4a32", fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} cursor={{ fill: "#f5f0eb" }} />
                  <Bar dataKey="count" fill="#a0845c" radius={[0, 6, 6, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skin Type Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">👤</span>
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Skin Type Distribution
                </h2>
              </div>
              <div className="flex items-center justify-center gap-8 flex-col sm:flex-row">
                <PieChart width={200} height={200}>
                  <Pie
                    data={mapWithColors(dashboardData?.skin_type_distribution)}
                    cx={95}
                    cy={95}
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {mapWithColors(dashboardData?.skin_type_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-3">
                  {mapWithColors(dashboardData?.skin_type_distribution).map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-[#5c4a32] font-medium w-24 truncate">{s.label}</span>
                      <span className="text-sm font-bold text-[#2d2416]">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-5 flex-col lg:flex-row mb-5">
            {/* Hair Concerns */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">💇</span>
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Top Hair Concerns
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={usersData?.hair_concern_distribution || []}
                  layout="vertical"
                  barCategoryGap="25%"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9a8a77" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#5c4a32", fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} cursor={{ fill: "#f5f0eb" }} />
                  <Bar dataKey="count" fill="#8b9e7a" radius={[0, 6, 6, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hair Type Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">✂️</span>
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Hair Type Distribution
                </h2>
              </div>
              <div className="flex items-center justify-center gap-8 flex-col sm:flex-row">
                <PieChart width={200} height={200}>
                  <Pie
                    data={mapWithColors(usersData?.hair_type_distribution)}
                    cx={95}
                    cy={95}
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {mapWithColors(usersData?.hair_type_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-3">
                  {mapWithColors(usersData?.hair_type_distribution).map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-[#5c4a32] font-medium w-24 truncate">{s.label}</span>
                      <span className="text-sm font-bold text-[#2d2416]">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-5 flex-col lg:flex-row mb-5">
            {/* Top Allergies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">⚠️</span>
                <h2 className="text-base font-semibold text-[#2d2416]">
                  Top Allergies
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={usersData?.top_allergies || []}
                  layout="vertical"
                  barCategoryGap="25%"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9a8a77" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#5c4a32", fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} cursor={{ fill: "#f5f0eb" }} />
                  <Bar dataKey="count" fill="#d4b382" radius={[0, 6, 6, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget & Phase Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">💰</span>
                  <h2 className="text-base font-semibold text-[#2d2416]">
                    Budget Pref
                  </h2>
                </div>
                <div className="flex items-center justify-center flex-col gap-4">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={mapWithColors(usersData?.budget_distribution)}
                      cx={65} cy={65} innerRadius={35} outerRadius={60} dataKey="value" labelLine={false}
                    >
                      {mapWithColors(usersData?.budget_distribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="flex flex-col gap-2 w-full">
                    {mapWithColors(usersData?.budget_distribution).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-[#5c4a32] truncate max-w-[80px]">{s.label}</span>
                        </div>
                        <span className="font-bold text-[#2d2416]">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-px bg-[#f5f0eb] hidden sm:block"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">📅</span>
                  <h2 className="text-base font-semibold text-[#2d2416]">
                    Phase
                  </h2>
                </div>
                <div className="flex items-center justify-center flex-col gap-4">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={mapWithColors(usersData?.phase_distribution)}
                      cx={65} cy={65} innerRadius={35} outerRadius={60} dataKey="value" labelLine={false}
                    >
                      {mapWithColors(usersData?.phase_distribution).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="flex flex-col gap-2 w-full">
                    {mapWithColors(usersData?.phase_distribution).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-[#5c4a32] truncate max-w-[80px]">{s.label}</span>
                        </div>
                        <span className="font-bold text-[#2d2416]">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
