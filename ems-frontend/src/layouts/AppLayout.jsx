import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Manage Users",
  "/admin/tasks": "Task Management",
  "/admin/attendance": "Attendance",
  "/admin/salary": "Salary Management",
  "/admin/profile": "My Profile",
  "/manager/dashboard": "Dashboard",
  "/manager/team": "My Team",
  "/manager/tasks": "Task Management",
  "/manager/attendance": "Team Attendance",
  "/manager/profile": "My Profile",
  "/employee/dashboard": "Dashboard",
  "/employee/tasks": "My Tasks",
  "/employee/attendance": "Attendance History",
  "/employee/salary": "Salary",
  "/employee/profile": "My Profile",
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "EMS";

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
