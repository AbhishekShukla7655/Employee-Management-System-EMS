import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CheckSquare,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  ClipboardList,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import { getInitials } from "../../utils/helpers";

import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../../services/api";

function DesignationText({ email }) {
  const { data } = useQuery({
    queryKey: ["sidebar-profile", email],
    queryFn: () => employeeService.getProfile().then((r) => r.data),
    enabled: !!email,
    staleTime: 1000 * 60 * 5,
  });
  if (!data?.designation) return null;
  return (
    <p
      className="text-xs mt-0.5 truncate"
      style={{ color: "rgba(255,255,255,0.55)" }}
    >
      {data.designation}
    </p>
  );
}
const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Manage Users", icon: Users, to: "/admin/users" },
  { label: "Tasks", icon: CheckSquare, to: "/admin/tasks" },
  { label: "Attendance", icon: Calendar, to: "/admin/attendance" },
  { label: "Salary", icon: DollarSign, to: "/admin/salary" },
];

const managerNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/manager/dashboard" },
  { label: "My Team", icon: Users, to: "/manager/team" },
  { label: "Tasks", icon: CheckSquare, to: "/manager/tasks" },
  { label: "Attendance", icon: Calendar, to: "/manager/attendance" },
  { label: "My Profile", icon: UserCircle, to: "/manager/profile" },
];

const employeeNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/employee/dashboard" },
  { label: "My Tasks", icon: ClipboardList, to: "/employee/tasks" },
  { label: "Attendance", icon: Calendar, to: "/employee/attendance" },
  { label: "Salary", icon: DollarSign, to: "/employee/salary" },
  { label: "My Profile", icon: UserCircle, to: "/employee/profile" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    role === "ADMIN" ? adminNav : role === "MANAGER" ? managerNav : employeeNav;

  const handleLogout = async () => {
    try {
      const { authService } = await import("../../services/api");
      await authService.logout();
    } catch {
      /* ignore */
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-[var(--bg-card)] border-r border-[var(--border)]
      transition-all duration-300 ${collapsed ? "w-16" : "w-60"} flex-shrink-0`}
    >
      {/* Logo */}
      {/* Profile Section */}
      <div
        className={`flex flex-col items-center gap-2 p-4 border-b border-[var(--border)] overflow-hidden ${collapsed ? "py-3" : "py-5"}`}
      >
        {/* Profile Picture */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: collapsed ? "36px" : "72px",
            height: collapsed ? "36px" : "72px",
          }}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
              style={{
                border: "2px solid #22d3ee",
                boxShadow: "0 0 12px rgba(34,211,238,0.5)",
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "2px solid #22d3ee",
                boxShadow: "0 0 12px rgba(34,211,238,0.5)",
                fontSize: collapsed ? "12px" : "22px",
              }}
            >
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </div>
          )}
        </div>

        {/* Name, Role, ID */}
        {!collapsed && (
          <div className="animate-fade-in text-center">
            <p className="font-semibold text-sm text-[var(--text-primary)] leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            {/* Designation — profile se aayega */}
            <DesignationText email={user?.email} />
            <p
              className="text-xs font-bold mt-0.5"
              style={{ color: "#60a5fa", letterSpacing: "0.05em" }}
            >
              {role}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Employee ID: {String(user?.id || 0).padStart(3, "0")}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && (
              <span className="animate-fade-in truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] animate-fade-in">
            <Avatar
              name={`${user?.firstName} ${user?.lastName}`}
              src={user?.profileImageUrl}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border)]
          flex items-center justify-center shadow-sm hover:bg-[var(--bg-secondary)] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
