import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../shared/Topbar";
import Sidebar from "../../src/component/Main/Sidebar/Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0ebe4] overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Main content area - offset by sidebar width on lg+ */}
      <div className="flex-1 flex flex-col h-screen lg:ml-72 transition-[margin] duration-300">
        {/* Fixed Topbar */}
        <div className="flex-shrink-0 sticky top-0 z-30">
          <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        </div>
        {/* Scrollable Outlet content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
