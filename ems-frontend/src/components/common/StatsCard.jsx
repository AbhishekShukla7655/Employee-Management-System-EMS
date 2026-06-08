import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'from-primary-500 to-violet-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-red-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-violet-600',
  }

  const bgMap = {
    primary: 'bg-primary-100 dark:bg-primary-900/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
    amber: 'bg-amber-100 dark:bg-amber-900/30',
    rose: 'bg-rose-100 dark:bg-rose-900/30',
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
  }

  const textMap = {
    primary: 'text-primary-600 dark:text-primary-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    rose: 'text-rose-600 dark:text-rose-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>}
          {trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trendValue}% from last month</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={textMap[color]} />
        </div>
      </div>
    </div>
  )
}
