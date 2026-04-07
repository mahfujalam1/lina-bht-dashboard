import { Outlet } from "react-router-dom";
import Topbar from "../shared/Topbar";
import Sidebar from "../../src/component/Main/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#f0ebe4]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
