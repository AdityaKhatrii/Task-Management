import { Outlet } from "react-router-dom";
import { Navbar } from "../Components/NavBar";
import { Sidebar } from "../Components/SideBar";

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}