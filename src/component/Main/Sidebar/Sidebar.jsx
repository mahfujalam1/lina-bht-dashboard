import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import {
  FaBoxOpen,
  FaBook,
  FaCreditCard,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaLeaf,
} from "react-icons/fa";

const navItems = [
  { label: "Overview", icon: <MdDashboard size={18} />, path: "/" },
  {
    label: "AI Configuration",
    icon: <GiArtificialIntelligence size={18} />,
    path: "/ai-configuration",
  },
  { label: "Products DB", icon: <FaBoxOpen size={18} />, path: "/products" },
  { label: "Nutrition", icon: <FaLeaf size={18} />, path: "/nutrition" },
  {
    label: "Education Content",
    icon: <FaBook size={18} />,
    path: "/education",
  },
  {
    label: "Subscriptions",
    icon: <FaCreditCard size={18} />,
    path: "/subscriptions",
  },
  { label: "Analytics", icon: <FaChartBar size={18} />, path: "/analytics" },
  { label: "Reminders", icon: <FaBell size={18} />, path: "/reminders" },
  { label: "Profile", icon: <FaUser size={18} />, path: "/settings/profile" },
  { label: "Settings", icon: <FaCog size={18} />, path: "/settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-[#f0ebe4] flex flex-col py-6 px-3 gap-1 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-6 px-3 flex items-center">
          <img src="/logo/gixy-logo.svg" alt="logo" className="size-16" />
          <span className="text-2xl font-bold text-[#2d2416] tracking-tight mt-2">
            Gixy
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-[#e3d9cc] text-[#2d2416] shadow-sm"
                    : "text-[#7a6a57] hover:bg-[#e8e0d8] hover:text-[#2d2416]"
                }`}
              >
                <span className={isActive ? "text-[#8b6914]" : ""}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[#ddd5c8] my-3 mx-2" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-[#b05a3a] hover:bg-[#f5e8e2] hover:text-[#8b3a1a]
            transition-all duration-150 w-full text-left"
        >
          <FaSignOutAlt size={16} />
          Log Out
        </button>
      </div>
    </>
  );
}
