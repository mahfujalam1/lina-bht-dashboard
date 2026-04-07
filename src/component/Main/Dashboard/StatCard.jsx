export default function StatCard({
  icon,
  label,
  value,
  growth,
  growthColor = "text-green-600",
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex-1 min-w-[160px] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#f5f0eb] flex items-center justify-center text-[#8b9e7a] text-xl">
          {icon}
        </div>
        {growth && (
          <span
            className={`text-xs font-semibold ${growthColor} bg-green-50 px-2 py-0.5 rounded-full`}
          >
            {growth}
          </span>
        )}
      </div>
      <p className="text-sm text-[#9a8a77] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#2d2416]">{value}</p>
    </div>
  );
}
