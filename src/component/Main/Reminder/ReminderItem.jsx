import { Switch, Tag } from "antd";
import { FiClock } from "react-icons/fi";

const tagColorMap = {
  routine: { color: "#8b6914", bg: "#f5edda" },
  scan: { color: "#3a5f8a", bg: "#ddeaf5" },
  wellness: { color: "#4a7a5a", bg: "#dff0e5" },
};

export default function ReminderItem({ reminder, onToggle }) {
  const { id, label, tag, defaultTime, enabled } = reminder;
  const tagStyle = tagColorMap[tag] || { color: "#666", bg: "#eee" };

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-[#faf8f5] rounded-xl border border-[#ede6db]">
      {/* Left: icon + text */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
          <FiClock size={16} className="text-[#9a8a78]" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-[#2d2416]">
              {label}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ color: tagStyle.color, backgroundColor: tagStyle.bg }}
            >
              {tag}
            </span>
          </div>
          <p className="text-xs text-[#9a8a78]">
            Default Time:&nbsp;
            <span className="font-medium text-[#6a5a48]">{defaultTime}</span>
          </p>
        </div>
      </div>

      {/* Right: toggle */}
      <Switch
        checked={enabled}
        onChange={(val) => onToggle(id, val)}
        style={{
          backgroundColor: enabled ? "#8b6914" : "#d4c9bb",
        }}
      />
    </div>
  );
}
