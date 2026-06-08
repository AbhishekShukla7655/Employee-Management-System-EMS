import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { dashboardService } from '../../services/api'
import StatsCard from '../../components/common/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency, getStatusColor, getPriorityColor } from '../../utils/helpers'
import Badge from '../../components/common/Badge'
import { formatDate } from '../../utils/helpers'

const mockAttendance = [
  { day: 'Mon', hours: 8.5 }, { day: 'Tue', hours: 9 }, { day: 'Wed', hours: 7.5 },
  { day: 'Thu', hours: 8 }, { day: 'Fri', hours: 8.5 }, { day: 'Sat', hours: 4 },
]

export default function EmployeeDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: () => dashboardService.getEmployeeStats().then(r => r.data),
    retry: 1,
  })

  if (isLoading) return <LoadingSpinner />
  const stats = data || {}

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="My Tasks" value={stats.totalTasks ?? 12} icon={CheckSquare} color="primary" />
        <StatsCard title="Completed" value={stats.completedTasks ?? 7} icon={CheckCircle2} color="emerald" />
        <StatsCard title="Pending" value={stats.pendingTasks ?? 3} icon={Clock} color="amber" />
        <StatsCard title="Attendance" value={`${stats.attendanceRate ?? 96}%`} icon={Calendar} color="blue" subtitle="This month" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <div className="xl:col-span-2 card p-5">
          <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">This Week's Hours</p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Daily working hours</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyHours || mockAttendance} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} domain={[0, 10]} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} formatter={(v) => [`${v}h`, 'Hours']} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {(stats.weeklyHours || mockAttendance).map((entry, i) => (
                  <Cell key={i} fill={entry.hours >= 8 ? '#10b981' : entry.hours >= 6 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Salary card */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Latest Salary</p>
            <p className="text-xs text-[var(--text-secondary)] mb-4">Current month breakdown</p>
          </div>
          {stats.latestSalary ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Basic</span>
                <span className="font-medium">{formatCurrency(stats.latestSalary.basicSalary)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Bonus</span>
                <span className="text-emerald-600">+{formatCurrency(stats.latestSalary.bonus || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Deductions</span>
                <span className="text-red-500">-{formatCurrency(stats.latestSalary.deductions || 0)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between">
                <span className="font-semibold text-[var(--text-primary)]">Net Salary</span>
                <span className="font-bold text-primary-600 text-lg">{formatCurrency(stats.latestSalary.netSalary)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 py-8">
              <div className="text-center">
                <DollarSign size={32} className="text-[var(--text-secondary)] mx-auto mb-2" />
                <p className="text-xs text-[var(--text-secondary)]">No salary data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent tasks */}
      {stats.recentTasks?.length > 0 && (
        <div className="card p-5">
          <p className="font-semibold text-[var(--text-primary)] text-sm mb-4">Recent Tasks</p>
          <div className="space-y-3">
            {stats.recentTasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{t.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Due {formatDate(t.dueDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(t.priority)}>{t.priority}</Badge>
                  <Badge className={getStatusColor(t.status)}>{t.status?.replace('_', ' ')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
