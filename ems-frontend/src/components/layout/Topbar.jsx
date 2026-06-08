import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Bell, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../common/Avatar'

export default function Topbar({ title }) {
  const { theme, toggleTheme } = useTheme()
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const { authService } = await import('../../services/api')
      await authService.logout()
    } catch { /* ignore */ } finally {
      logout()
      navigate('/login')
    }
  }

  const profilePath = role === 'ADMIN' ? '/admin/profile'
    : role === 'MANAGER' ? '/manager/profile'
    : '/employee/profile'

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between px-6 flex-shrink-0">
      {/* Left - Title */}
      <div>
        <h1 className="text-base font-semibold text-[var(--text-primary)]">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200"
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(o => !o)}
            className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 relative"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-card)]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 card shadow-lg z-50 animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Notifications</p>
              </div>
              <div className="py-2">
                {[
                  { title: 'New task assigned', time: '2 min ago', dot: 'bg-primary-500' },
                  { title: 'Attendance marked', time: '1 hr ago', dot: 'bg-emerald-500' },
                  { title: 'Salary slip ready', time: 'Yesterday', dot: 'bg-amber-500' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] cursor-pointer">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-primary)]">{n.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-all duration-200"
          >
            <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.profileImageUrl} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-[var(--text-primary)] leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-none mt-0.5">{role}</p>
            </div>
            <ChevronDown size={13} className="text-[var(--text-secondary)]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-48 card shadow-lg z-50 animate-slide-up overflow-hidden">
              <div className="py-1">
                <button
                  onClick={() => { navigate(profilePath); setDropdownOpen(false) }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <User size={14} /> My Profile
                </button>
                <div className="border-t border-[var(--border)] my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(dropdownOpen || notificationsOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setDropdownOpen(false); setNotificationsOpen(false) }} />
      )}
    </header>
  )
}
