import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { authService } from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError(null);
    try {
      await authService.register({ ...data, role: "EMPLOYEE" });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const inputClass =
    "w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
  };

  return (
    <div
      className="min-h-screen w-full flex relative"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      {/* Left Hero */}
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
              <span className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center flex-shrink-0">
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

      {/* Right Form */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-10 pt-24">
        {/* Toggle — top right fixed */}
        <div
          className="absolute top-5 right-8 z-20 flex gap-1 rounded-full p-1"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <button
            className="px-6 py-2 rounded-full text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "0 0 18px rgba(59,130,246,0.6)",
            }}
          >
            Register
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Login
          </button>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(10,20,50,0.80)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
              <p className="text-xs text-emerald-300">
                ✓ Account created! Redirecting to login...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/80 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    placeholder="John"
                    className={inputClass}
                    style={inputStyle}
                    {...register("firstName", { required: "Required" })}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    placeholder="Doe"
                    className={inputClass}
                    style={inputStyle}
                    {...register("lastName", { required: "Required" })}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className={inputClass}
                  style={inputStyle}
                  {...register("email", {
                    required: "Required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  className={inputClass}
                  style={inputStyle}
                  {...register("phoneNumber", { required: "Required" })}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min 6 characters"
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
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

            <div>
              <label className="block text-sm text-white/80 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  className={`${inputClass} pr-10`}
                  style={inputStyle}
                  {...register("confirmPassword", {
                    required: "Required",
                    validate: (v) =>
                      v === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full py-3 rounded-xl font-bold text-white text-base bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 mt-1"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-5">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 font-semibold hover:text-blue-300"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
