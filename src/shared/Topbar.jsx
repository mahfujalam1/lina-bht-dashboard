import { useState, useRef, useEffect } from "react";
import { Badge, Avatar } from "antd";
import { FaBell, FaCheckDouble, FaCheck } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";

const initialNotifications = [
  {
    id: 1,
    title: "New User Registered",
    message: "Sarah Johnson just created an account.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Subscription Upgraded",
    message: "User #4821 upgraded to Premium plan.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    title: "New Video Published",
    message: '"Facial Massage Techniques" is now live.',
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    title: "AI Config Updated",
    message: "Skin analysis model v2.4 deployed.",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: 5,
    title: "Weekly Report Ready",
    message: "Analytics report for this week is available.",
    time: "5 hrs ago",
    read: true,
  },
];

export default function Topbar({ onToggleSidebar }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

      {/* Spacer for desktop (pushes right content to end) */}
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
              style={{
                animation: "notifSlideIn 0.2s ease-out",
              }}
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
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-default
                      ${
                        notif.read
                          ? "bg-white"
                          : "bg-[#fdf8f2] hover:bg-[#f9f1e7]"
                      }
                      border-b border-[#f5f0eb] last:border-b-0`}
                  >
                    {/* Unread dot */}
                    <div className="mt-1.5 flex-shrink-0">
                      {!notif.read ? (
                        <span className="block w-2 h-2 rounded-full bg-[#c97d2a]" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          notif.read
                            ? "text-[#7a6a57] font-normal"
                            : "text-[#2d2416] font-semibold"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-[#9a8a77] mt-0.5 truncate">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-[#b8a994] mt-1">
                        {notif.time}
                      </p>
                    </div>

                    {/* Mark as read button */}
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="flex-shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[#9a8a77] hover:text-[#8b6914] hover:bg-[#f0ebe4] transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck size={10} />
                      </button>
                    )}
                  </div>
                ))}
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
    </div>
  );
}
