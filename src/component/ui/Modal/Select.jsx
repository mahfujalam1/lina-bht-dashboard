import React from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Category",
}) {
  return (
    <label className="relative block w-full">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-gray-200"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600" />
    </label>
  );
}
