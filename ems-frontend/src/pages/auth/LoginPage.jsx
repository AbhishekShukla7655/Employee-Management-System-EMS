import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError(null);
    try {
      const res = await authService.login(data);
      const { accessToken, refreshToken, user } = res.data;
      login(user, accessToken, refreshToken);
      const redirectMap = {
        ADMIN: "/admin/dashboard",
        MANAGER: "/manager/dashboard",
        EMPLOYEE: "/employee/dashboard",
      };
      navigate(redirectMap[user.role] || "/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Toggle — top right fixed */}
      <div
        className="absolute top-5 right-8 z-20 flex gap-1 rounded-full p-1"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Register
        </button>
        <button
          className="px-6 py-2 rounded-full text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "0 0 18px rgba(59,130,246,0.6)",
          }}
        >
          Login
        </button>
      </div>

      {/* Left — Hero */}
      <div className="relative z-10 hidden lg:flex flex-col justify-center px-16 w-1/2">
        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          <span className="text-cyan-400">Employee</span>
          <br />
          <span className="text-white">Management</span>
          <br />
          <span className="text-white">System</span>
        </h1>
        <p className="text-cyan-400 italic text-lg font-semibold mb-10">
          Streamline Your Workforce Efficiently.
        </p>
        <ul className="space-y-4">
          {[
            "Track Employee Attendance & Performance",
            "Manage Payroll & Leave Requests",
            "Streamline Team Communication",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-white text-sm font-medium"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(37,99,235,0.7)",
                  border: "1px solid rgba(59,130,246,0.5)",
                }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right — Form */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full lg:w-1/2 px-6">
        {/* Card */}
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(8,18,45,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99,179,237,0.25)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Member Login</h2>

          {error && (
            <div
              className="mb-4 p-3 rounded-xl"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.35)",
              }}
            >
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid rgba(59,130,246,0.7)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid rgba(255,255,255,0.12)")
                  }
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid rgba(59,130,246,0.7)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid rgba(255,255,255,0.12)")
                  }
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <p
              className="text-xs cursor-pointer transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.8)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.45)")
              }
            >
              Forgot Password?
            </p>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60"
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-60 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Need an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold transition-colors"
              style={{ color: "#60a5fa" }}
              onMouseEnter={(e) => (e.target.style.color = "#93c5fd")}
              onMouseLeave={(e) => (e.target.style.color = "#60a5fa")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
