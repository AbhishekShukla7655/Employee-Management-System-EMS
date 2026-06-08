import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

// Route guard
import ProtectedRoute from "./ProtectedRoute";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import TasksPage from "../pages/admin/TasksPage";
import AdminAttendancePage from "../pages/admin/AttendancePage";
import SalaryPage from "../pages/admin/SalaryPage";
import AdminProfilePage from "../pages/admin/ProfilePage";

// Manager pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerTeamPage from "../pages/manager/ManagerTeamPage";
import ManagerTasksPage from "../pages/manager/ManagerTasksPage";
import ManagerAttendancePage from "../pages/manager/ManagerAttendancePage";
import ManagerProfilePage from "../pages/manager/ManagerProfilePage";

// Employee pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeTasksPage from "../pages/employee/EmployeeTasksPage";
import EmployeeAttendancePage from "../pages/employee/EmployeeAttendancePage";
import EmployeeSalaryPage from "../pages/employee/EmployeeSalaryPage";
import EmployeeProfilePage from "../pages/employee/EmployeeProfilePage";

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const map = {
    ADMIN: "/admin/dashboard",
    MANAGER: "/manager/dashboard",
    EMPLOYEE: "/employee/dashboard",
  };
  return <Navigate to={map[role] || "/login"} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/tasks" element={<TasksPage />} />
        <Route path="/admin/attendance" element={<AdminAttendancePage />} />
        <Route path="/admin/salary" element={<SalaryPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>

      {/* Manager routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/team" element={<ManagerTeamPage />} />
        <Route path="/manager/tasks" element={<ManagerTasksPage />} />
        <Route path="/manager/attendance" element={<ManagerAttendancePage />} />
        <Route path="/manager/profile" element={<ManagerProfilePage />} />
      </Route>

      {/* Employee routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/tasks" element={<EmployeeTasksPage />} />
        <Route
          path="/employee/attendance"
          element={<EmployeeAttendancePage />}
        />
        <Route path="/employee/salary" element={<EmployeeSalaryPage />} />
        <Route path="/employee/profile" element={<EmployeeProfilePage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
