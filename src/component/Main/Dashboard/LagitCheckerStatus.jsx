
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export default function LagitCheckerStatus() {

  const statusData =  {};

  const stats = [
    {
      label: "Total Order",
      value: statusData?.totalOrder || 130,
      icon: <ShoppingCartOutlined />,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Total Approved",
      value: statusData?.totalApproved || 80,
      icon: <CheckCircleOutlined />,
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#6ee7b7",
    },
    {
      label: "Total Rejected",
      value: statusData?.totalRejected || 5,
      icon: <CloseCircleOutlined />,
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fca5a5",
    },
    {
      label: "Total Pending",
      value: statusData?.totalPending || 45,
      icon: <ClockCircleOutlined />,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
  ];

  const format = (value) => new Intl.NumberFormat().format(value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 16,
            padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: s.color,
              boxShadow: `0 2px 8px ${s.border}`,
              marginBottom: 4,
            }}
          >
            {s.icon}
          </div>

          {/* Value */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: s.color,
              lineHeight: 1.1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {format(s.value)}
          </div>

          {/* Label */}
          <div style={{ fontSize: 15, color: "#6b7280", fontWeight: 500 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
