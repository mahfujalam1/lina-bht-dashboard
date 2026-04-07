import { Badge, Avatar } from "antd";
import { FaBell } from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="h-16 bg-[#f0ebe4] flex items-center justify-end px-8 gap-5">
      <Badge count={3} size="small" color="#c97d2a">
        <div className="w-9 h-9 rounded-full bg-[#e3d9cc] flex items-center justify-center cursor-pointer hover:bg-[#d9cfc0] transition-colors">
          <FaBell size={16} className="text-[#5c4a32]" />
        </div>
      </Badge>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-[#2d2416] leading-tight">
            System Admin
          </p>
          <p className="text-xs text-[#9a8a77]">Super User</p>
        </div>
        <Avatar
          style={{ backgroundColor: "#8b9e7a", color: "#fff", fontWeight: 600 }}
          size={38}
        >
          SA
        </Avatar>
      </div>
    </div>
  );
}
