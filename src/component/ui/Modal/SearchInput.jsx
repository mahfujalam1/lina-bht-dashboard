import React from "react";
import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
        placeholder={placeholder}
      />
    </label>
  );
}
