/* eslint-disable react/prop-types */
import { Button } from "antd";
import { FiActivity, FiEdit2 } from "react-icons/fi";
import { useGetEndpointUsageQuery } from "../../../redux/features/aiConfig/aiConfigApi";

const endpointNames = {
  face_scan: "Face Scan",
  scalp_scan: "Scalp Scan",
  skin_scan: "Skin Scan",
  product_scan: "Product Scan",
  routine_generate: "Routine Generate",
  lia_chat: "Gixy Chat",
};

export default function LimitCard({ limit, onEdit }) {
  const { data, isLoading } = useGetEndpointUsageQuery(limit.endpoint_id);
  const usage = data?.last_24h;
  const isToken = limit.type === "token";
  const freeLimit = isToken ? limit.free_token_budget : limit.free_max_uses;
  const premiumLimit = isToken
    ? limit.premium_token_budget
    : limit.premium_max_uses;
  const usageValue = isToken ? usage?.total_tokens : usage?.total_calls;

  return (
    <div className="bg-white rounded-xl border border-[#eee9e2] p-4 shadow-[0_2px_10px_rgba(45,36,22,0.03)] transition-all hover:border-[#ddd5c7]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[#2d2416]">
            {endpointNames[limit.endpoint_id] || limit.endpoint_id}
          </h3>
          <p className="text-[10px] uppercase tracking-wide text-[#a08f7a] mt-0.5">
            {isToken ? "Tokens" : "Requests"}
          </p>
        </div>
        <Button
          type="text"
          aria-label={`Edit ${endpointNames[limit.endpoint_id] || limit.endpoint_id} limits`}
          icon={<FiEdit2 />}
          onClick={() => onEdit(limit)}
          className="!text-[#8b7355] !w-7 !h-7 !min-w-7 hover:!bg-[#f5f0eb] !rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 mt-3 rounded-lg bg-[#f7f4f0]">
        {[
          ["Free", freeLimit, limit.free_period_days],
          ["Premium", premiumLimit, limit.premium_period_days],
        ].map(([plan, value, days]) => (
          <div
            key={plan}
            className="px-3 py-2.5 first:border-r first:border-[#e7e0d7]"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#9a8a77]">
              {plan}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <p className="text-sm font-bold text-[#2d2416]">
                {(value ?? 0).toLocaleString()}
              </p>
              <p className="text-[9px] text-[#9a8a77]">/ {days}d</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[#9a8a77]">
        <FiActivity className="shrink-0 text-[#8b9e7a]" size={13} />
        <span>
          24h usage:
          <strong className="text-[#5c4a32] ml-1">
            {isLoading ? "..." : (usageValue ?? 0).toLocaleString()}
          </strong>
          {" / "}
          {usage?.unique_users ?? 0} user{usage?.unique_users === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
