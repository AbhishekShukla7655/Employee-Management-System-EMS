import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { attendanceService } from '../../services/api'
import { formatDate, getStatusColor } from '../../utils/helpers'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { usePagination } from '../../hooks/useCommon'
import { useState } from 'react'

export default function ManagerAttendancePage() {
  const { page, size, nextPage, prevPage, goToPage } = usePagination()
  const [dateFilter, setDateFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['team-attendance', page, dateFilter],
    queryFn: () => attendanceService.getTeamAttendance({ page, size, date: dateFilter }).then(r => r.data),
    retry: 1,
  })

  const records = data?.content || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-auto" />
        {dateFilter && (
          <button onClick={() => setDateFilter('')} className="text-xs text-primary-600 hover:underline">Clear</button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="table-header text-left">Employee</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Check In</th>
                <th className="table-header text-left">Check Out</th>
                <th className="table-header text-left">Hours</th>
                <th className="table-header text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6}><LoadingSpinner /></td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6}><EmptyState title="No attendance records" icon={Calendar} /></td></tr>
              ) : records.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.employeeName} size="sm" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="table-cell text-[var(--text-secondary)]">{formatDate(r.date)}</td>
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
