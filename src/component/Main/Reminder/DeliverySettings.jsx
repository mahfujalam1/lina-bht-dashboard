import { useState } from "react";
import { Switch, Select } from "antd";

const timezoneOptions = [
  { value: "local", label: "User's Local Time" },
  { value: "utc", label: "UTC" },
  { value: "est", label: "Eastern Time (EST)" },
  { value: "pst", label: "Pacific Time (PST)" },
  { value: "gmt", label: "GMT+0" },
];

export default function DeliverySettings() {
  const [smartTiming, setSmartTiming] = useState(true);
  const [timezone, setTimezone] = useState("local");

  return (
    <div className="bg-white rounded-2xl border border-[#ede6db] p-6 shadow-sm">
      <h3 className="text-base font-semibold text-[#2d2416] mb-5">
        Delivery Settings
      </h3>

      {/* Smart Timing */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#2d2416]">
            Smart Timing
          </span>
        </div>
        <p className="text-xs text-[#9a8a78] mb-3 leading-relaxed">
          AI adjusts delivery time based on user's past engagement.
        </p>
        <Switch
          checked={smartTiming}
          onChange={setSmartTiming}
          style={{ backgroundColor: smartTiming ? "#8b6914" : "#d4c9bb" }}
        />
      </div>

      {/* Timezone Handling */}
      <div>
        <label className="block text-sm font-semibold text-[#2d2416] mb-2">
          Timezone Handling
        </label>
        <Select
          value={timezone}
          onChange={setTimezone}
          options={timezoneOptions}
          className="w-full"
          style={{ height: 40 }}
          styles={{
            popup: { root: { borderRadius: 12, border: "1px solid #ede6db" } },
          }}
        />
      </div>
    </div>
  );
}
