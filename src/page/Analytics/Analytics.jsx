import { useRef, useState } from "react";
import { Button, Select } from "antd";
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

const skinConcerns = [
  { concern: "Acne", count: 5800 },
  { concern: "Redness", count: 3200 },
  { concern: "Dryness", count: 3000 },
  { concern: "Aging", count: 2400 },
  { concern: "Pigmentation", count: 1800 },
];

const skinTypes = [
  { name: "Combination", value: 45, color: "#a0845c" },
  { name: "Oily", value: 25, color: "#8b9e7a" },
  { name: "Dry", value: 20, color: "#5c4a32" },
  { name: "Normal", value: 10, color: "#e8d8c4" },
];

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
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [ageGroup, setAgeGroup] = useState("All Ages");
  const [gender, setGender] = useState("All Genders");

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
            options={[
              { value: "Last 7 Days", label: "Last 7 Days" },
              { value: "Last 30 Days", label: "Last 30 Days" },
              { value: "Last 90 Days", label: "Last 90 Days" },
              { value: "Last 6 Months", label: "Last 6 Months" },
              { value: "Last 1 Year", label: "Last 1 Year" },
              { value: "All Time", label: "All Time" },
            ]}
          />
          <Select
            value={ageGroup}
            onChange={setAgeGroup}
            className="w-36"
            options={[
              { value: "All Ages", label: "All Ages" },
              { value: "18-24", label: "18-24" },
              { value: "25-34", label: "25-34" },
              { value: "35-44", label: "35-44" },
              { value: "45-54", label: "45-54" },
              { value: "55+", label: "55+" },
            ]}
          />
          <Select
            value={gender}
            onChange={setGender}
            className="w-36"
            options={[
              { value: "All Genders", label: "All Genders" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
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

      {/* Report content - this gets exported to PDF */}
      <div ref={reportRef}>
        {/* Filter summary bar */}
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm mb-5 flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold text-[#9a8a77] uppercase tracking-wide">
            Filters Applied:
          </span>
          <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
            {dateRange}
          </span>
          <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
            {ageGroup}
          </span>
          <span className="text-xs bg-[#f5f0eb] text-[#5c4a32] px-3 py-1 rounded-full font-medium">
            {gender}
          </span>
        </div>

        <div className="flex gap-5 flex-col lg:flex-row">
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
                data={skinConcerns}
                layout="vertical"
                barCategoryGap="25%"
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#9a8a77" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="concern"
                  tick={{ fontSize: 12, fill: "#5c4a32", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
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
                  dataKey="count"
                  fill="#a0845c"
                  radius={[0, 6, 6, 0]}
                  name="Users"
                />
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
                  data={skinTypes}
                  cx={95}
                  cy={95}
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {skinTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-3">
                {skinTypes.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm text-[#5c4a32] font-medium w-24">
                      {s.name}
                    </span>
                    <span className="text-sm font-bold text-[#2d2416]">
                      {s.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
