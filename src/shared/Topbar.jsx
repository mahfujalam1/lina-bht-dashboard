import { useState, useRef, useEffect } from "react";
import { Badge, Avatar, Spin } from "antd";
import { FaBell, FaCheckDouble, FaCheck } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useMeQuery } from "../redux/features/auth/authApi";
import { useGetNotificationHistoryQuery } from "../redux/features/notification/notificationApi";

export default function Topbar({ onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dropdownRef = useRef(null);
  const { data: meData } = useMeQuery();

  const { data: historyData, isLoading: isHistoryLoading } = useGetNotificationHistoryQuery(
    { limit: 20, offset: 0, unread_only: false },
    { skip: !dropdownOpen }
  );

  const notifications = historyData?.notifications || historyData?.items || [];

  const unreadCount = notifications.filter((n) => !n.is_read && !readIds.has(n._id || n.id)).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const markAsRead = (id) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n._id || n.id);
    setReadIds(new Set(allIds));
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="h-16 bg-[#f0ebe4] flex items-center justify-between px-4 md:px-8 gap-5">
      {/* Hamburger - visible only on mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#2d2416] hover:bg-[#e3d9cc] transition-colors"
        aria-label="Toggle sidebar"
      >
        <HiMenuAlt2 size={24} />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification Bell + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Badge count={unreadCount} size="small" color="#c97d2a">
            <div
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-[#e3d9cc] flex items-center justify-center cursor-pointer hover:bg-[#d9cfc0] transition-colors"
            >
              <FaBell size={16} className="text-[#5c4a32]" />
            </div>
          </Badge>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-[#f0ebe4] z-50 overflow-hidden"
              style={{ animation: "notifSlideIn 0.2s ease-out" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0ebe4]">
                <h3 className="text-sm font-semibold text-[#2d2416]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#8b6914] hover:text-[#6d5310] transition-colors"
                  >
                    <FaCheckDouble size={11} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-72 overflow-y-auto">
                {isHistoryLoading ? (
                  <div className="flex justify-center items-center h-24">
                    <Spin size="small" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 text-[#9a8a77]">
                    <FaBell size={20} className="mb-2 opacity-30" />
                    <p className="text-xs">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const notifId = notif._id || notif.id;
                    const isRead = notif.is_read || readIds.has(notifId);
                    return (
                      <div
                        key={notifId}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-default
                          ${isRead ? "bg-white" : "bg-[#fdf8f2] hover:bg-[#f9f1e7]"}
                          border-b border-[#f5f0eb] last:border-b-0`}
                      >
                        {/* Unread dot */}
                        <div className="mt-1.5 flex-shrink-0">
                          {!isRead ? (
                            <span className="block w-2 h-2 rounded-full bg-[#c97d2a]" />
                          ) : (
                            <span className="block w-2 h-2 rounded-full bg-transparent" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${isRead ? "text-[#7a6a57] font-normal" : "text-[#2d2416] font-semibold"}`}>
                            {notif.title || notif.trigger || "Notification"}
                          </p>
                          <p className="text-xs text-[#9a8a77] mt-0.5 truncate">
                            {notif.message || notif.body || notif.trigger || ""}
                          </p>
                          <p className="text-[10px] text-[#b8a994] mt-1">
                            {formatTime(notif.created_at || notif.sent_at)}
                          </p>
                        </div>

                        {/* Mark as read button */}
                        {!isRead && (
                          <button
                            onClick={() => markAsRead(notifId)}
                            className="flex-shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[#9a8a77] hover:text-[#8b6914] hover:bg-[#f0ebe4] transition-colors"
                            title="Mark as read"
                          >
                            <FaCheck size={10} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#f0ebe4] bg-[#faf7f3]">
                <p className="text-xs text-center text-[#9a8a77] font-medium cursor-pointer hover:text-[#5c4a32] transition-colors">
                  View all notifications
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#2d2416] leading-tight">
              {meData?.admin?.full_name}
            </p>
            <p className="text-xs text-[#9a8a77]">{meData?.admin?.email}</p>
          </div>
          <div className="relative cursor-pointer group">
            <Avatar
              size={40}
              src={meData?.admin?.avatar_url || "https://i.pravatar.cc/150?img=3"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
