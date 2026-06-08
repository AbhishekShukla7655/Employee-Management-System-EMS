import { useQuery } from '@tanstack/react-query'
import {
  Users, UserCog, CheckSquare, Clock, TrendingUp, DollarSign,
  Calendar, BarChart3, AlertCircle, CheckCircle2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { dashboardService } from '../../services/api'
import StatsCard from '../../components/common/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// Mock data for charts when API data isn't available
const mockMonthlyData = [
  { month: 'Jul', employees: 45, tasks: 120 },
  { month: 'Aug', employees: 48, tasks: 145 },
  { month: 'Sep', employees: 52, tasks: 132 },
  { month: 'Oct', employees: 55, tasks: 168 },
  { month: 'Nov', employees: 58, tasks: 155 },
  { month: 'Dec', employees: 62, tasks: 190 },
]

const mockTaskDistribution = [
  { name: 'Completed', value: 42 },
  { name: 'In Progress', value: 28 },
  { name: 'Pending', value: 30 },
]

const mockDeptData = [
  { dept: 'Engineering', count: 18 },
  { dept: 'Design', count: 8 },
  { dept: 'Marketing', count: 10 },
  { dept: 'Sales', count: 12 },
  { dept: 'HR', count: 6 },
]

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminStats().then(r => r.data),
    retry: 1,
  })

  if (isLoading) return <LoadingSpinner />

  const stats = data || {}

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Employees" value={stats.totalEmployees ?? 62} icon={Users} color="primary" trendValue={8} trend="up" />
        <StatsCard title="Total Managers" value={stats.totalManagers ?? 8} icon={UserCog} color="blue" />
        <StatsCard title="Total Tasks" value={stats.totalTasks ?? 190} icon={CheckSquare} color="amber" trendValue={12} trend="up" />
        <StatsCard title="Completed Tasks" value={stats.completedTasks ?? 80} icon={CheckCircle2} color="emerald" subtitle={`${stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 42}% completion rate`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Pending Tasks" value={stats.pendingTasks ?? 57} icon={Clock} color="rose" />
        <StatsCard title="In Progress" value={stats.inProgressTasks ?? 53} icon={AlertCircle} color="purple" />
        <StatsCard title="Monthly Payroll" value={formatCurrency(stats.monthlyPayroll ?? 2450000)} icon={DollarSign} color="emerald" />
        <StatsCard title="Attendance Rate" value={`${stats.attendanceRate ?? 94}%`} icon={Calendar} color="primary" trendValue={2} trend="up" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Headcount & Tasks trend */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-[var(--text-primary)] text-sm">Growth Overview</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Employee headcount & task volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthlyData || mockMonthlyData}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="employees" stroke="#6366f1" strokeWidth={2} fill="url(#empGrad)" name="Employees" />
              <Area type="monotone" dataKey="tasks" stroke="#10b981" strokeWidth={2} fill="url(#taskGrad)" name="Tasks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution Pie */}
        <div className="card p-5">
          <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Task Distribution</p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Current status breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.taskDistribution || mockTaskDistribution}
                cx="50%" cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {(stats.taskDistribution || mockTaskDistribution).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Bar Chart */}
      <div className="card p-5">
        <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Department Headcount</p>
        <p className="text-xs text-[var(--text-secondary)] mb-4">Employees per department</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.departmentData || mockDeptData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Employees" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
