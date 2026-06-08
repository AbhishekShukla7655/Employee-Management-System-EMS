import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { attendanceService } from '../../services/api'
import { formatDate, getStatusColor } from '../../utils/helpers'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { usePagination } from '../../hooks/useCommon'
import { useState } from 'react'

export default function EmployeeAttendancePage() {
  const { page, size, nextPage, prevPage, goToPage } = usePagination(0, 20)
  const [monthFilter, setMonthFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-attendance', page, monthFilter],
    queryFn: () => attendanceService.getMyAttendance({ page, size, month: monthFilter }).then(r => r.data),
    retry: 1,
  })

  const records = data?.content || []
  const totalPages = data?.totalPages || 0

  // Summary counts
  const summary = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Present', key: 'PRESENT', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
          { label: 'Absent', key: 'ABSENT', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
          { label: 'Half Day', key: 'HALF_DAY', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
          { label: 'Leave', key: 'LEAVE', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
        ].map(s => (
          <div key={s.key} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${s.cls}`}>
            {s.label}: {summary[s.key] || 0}
          </div>
        ))}
        <div className="ml-auto">
          <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="input w-auto text-xs" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Check In</th>
                <th className="table-header text-left">Check Out</th>
                <th className="table-header text-left">Total Hours</th>
                <th className="table-header text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5}><LoadingSpinner /></td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5}><EmptyState title="No attendance records" icon={Calendar} /></td></tr>
              ) : records.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="table-cell font-medium">{formatDate(r.date)}</td>
                  <td className="table-cell text-sm">{r.checkIn || '—'}</td>
                  <td className="table-cell text-sm">{r.checkOut || '—'}</td>
                  <td className="table-cell text-sm">{r.totalHours ? `${r.totalHours}h` : '—'}</td>
                  <td className="table-cell"><Badge className={getStatusColor(r.status)}>{r.status?.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)]">Page {page + 1} of {totalPages}</p>
            <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} onGoTo={goToPage} />
          </div>
        )}
      </div>
    </div>
  )
}
