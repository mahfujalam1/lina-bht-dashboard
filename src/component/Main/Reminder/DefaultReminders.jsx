import { Button } from "antd";
import { FiBell, FiPlus } from "react-icons/fi";
import ReminderItem from "./ReminderItem";
export default function DefaultReminders({ reminders, setReminders }) {

  const handleToggle = (id, val) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: val } : r)),
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ede6db] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f5edda] flex items-center justify-center">
            <FiBell size={16} className="text-[#8b6914]" />
          </div>
          <span className="text-base font-semibold text-[#2d2416]">
            Default Reminders
          </span>
        </div>
      </div>

      {/* Reminder list */}
      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <ReminderItem key={r.id} reminder={r} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
