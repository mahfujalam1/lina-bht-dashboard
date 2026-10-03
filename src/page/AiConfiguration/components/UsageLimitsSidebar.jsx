/* eslint-disable react/prop-types */
import { Spin } from "antd";
import LimitCard from "./LimitCard";

export default function UsageLimitsSidebar({
  limitsData,
  isLoadingLimits,
  onEditLimit,
}) {
  return (
    <aside
      className="w-full flex flex-col gap-3 shrink-0"
      style={{ flex: "0 0 300px", maxWidth: "300px" }}
    >
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-semibold text-[#2d2416]">Usage Limits</h2>
          <p className="text-[11px] text-[#9a8a77] mt-0.5">
            Plan allowances and activity
          </p>
        </div>
        {isLoadingLimits && <Spin size="small" />}
      </div>

      {limitsData?.limits?.map((limit) => (
        <LimitCard
          key={limit.endpoint_id}
          limit={limit}
          onEdit={onEditLimit}
        />
      ))}

      {!isLoadingLimits && !limitsData?.limits?.length && (
        <div className="bg-white rounded-2xl p-5 text-xs text-[#9a8a77] shadow-sm border border-[#eee9e2]">
          No usage limits are configured.
        </div>
      )}
    </aside>
  );
}
