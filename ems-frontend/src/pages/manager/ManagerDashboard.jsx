import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Users, Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { dashboardService } from '../../services/api'
import StatsCard from '../../components/common/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

const mockTaskStatus = [
  { name: 'Completed', value: 15 },
  { name: 'In Progress', value: 8 },
  { name: 'Pending', value: 12 },
]

const mockWeekly = [
  { day: 'Mon', tasks: 4 }, { day: 'Tue', tasks: 7 }, { day: 'Wed', tasks: 3 },
  { day: 'Thu', tasks: 8 }, { day: 'Fri', tasks: 6 }, { day: 'Sat', tasks: 2 },
]

export default function ManagerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: () => dashboardService.getManagerStats().then(r => r.data),
    retry: 1,
  })

  if (isLoading) return <LoadingSpinner />
  const stats = data || {}

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard title="Team Members" value={stats.teamSize ?? 8} icon={Users} color="blue" />
        <StatsCard title="Assigned Tasks" value={stats.assignedTasks ?? 35} icon={CheckSquare} color="primary" />
        <StatsCard title="Completed Tasks" value={stats.completedTasks ?? 15} icon={CheckCircle2} color="emerald" subtitle={`${stats.completionRate ?? 43}% completion rate`} />
        <StatsCard title="In Progress" value={stats.inProgressTasks ?? 8} icon={AlertCircle} color="amber" />
        <StatsCard title="Pending Tasks" value={stats.pendingTasks ?? 12} icon={Clock} color="rose" />
        <StatsCard title="Team Performance" value={`${stats.performanceScore ?? 78}%`} icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Weekly Task Completion</p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Tasks completed this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyData || mockWeekly} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Task Status</p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Current distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.taskStatusData || mockTaskStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {(stats.taskStatusData || mockTaskStatus).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
