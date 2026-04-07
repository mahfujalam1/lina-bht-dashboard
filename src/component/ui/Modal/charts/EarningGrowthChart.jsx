import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { earningDemoData } from "./DemoData";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const FULL_MONTHS = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export default function EarningGrowthChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const availableYears = useMemo(() => {
    const years = [];
    for (let y = 2024; y <= currentYear; y++) years.push(y);
    return years;
  }, [currentYear]);

  const chartData = useMemo(() => {
    const yearData = earningDemoData[year] || [];
    return MONTHS.map((_, i) => {
      const found = yearData.find((d) => d.month === i + 1);
      return found ? found.total : 0;
    });
  }, [year]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    chartRef.current?.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: MONTHS.map((m) => FULL_MONTHS[m]),
        datasets: [
          {
            label: `${year}`,
            data: chartData,
            borderColor: "#6366f1",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#6366f1",
            pointBorderWidth: 2,
            fill: "start",
            backgroundColor: (context) => {
              const { chart } = context;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return "rgba(99,102,241,0.08)";
              const gradient = c.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom,
              );
              gradient.addColorStop(0, "rgba(99,102,241,0.22)");
              gradient.addColorStop(1, "rgba(99,102,241,0.01)");
              return gradient;
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#fff",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            titleColor: "#374151",
            bodyColor: "#6b7280",
            callbacks: { label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}` },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              maxRotation: 45,
              minRotation: 0,
              maxTicksLimit: 6,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              callback: (val) => `$${(val / 1000).toFixed(0)}k`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [year, chartData]);

  return (
    <div className="growth-chart-card">
      <div className="growth-chart-header">
        <span className="growth-chart-title">Earning Growth</span>
        <select
          className="growth-chart-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="growth-chart-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
      <div className="growth-chart-legend">
        <svg width="18" height="10" viewBox="0 0 18 10">
          <line
            x1="0"
            y1="5"
            x2="18"
            y2="5"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="3,2"
          />
          <circle
            cx="9"
            cy="5"
            r="3"
            fill="#fff"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
        </svg>
        {year}
      </div>
    </div>
  );
}
