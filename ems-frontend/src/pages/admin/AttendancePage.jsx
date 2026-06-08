import { useQuery } from '@tanstack/react-query'
import { Search, Calendar } from 'lucide-react'
import { attendanceService } from '../../services/api'
import { formatDate, getStatusColor } from '../../utils/helpers'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Avatar from '../../components/common/Avatar'
import { useSearch, usePagination } from '../../hooks/useCommon'
import { useState } from 'react'

export default function AdminAttendancePage() {
  const { value: search, debouncedValue: dSearch, onChange: onSearchChange } = useSearch()
  const { page, size, nextPage, prevPage, goToPage } = usePagination()
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-all', dSearch, page, dateFilter, statusFilter],
    queryFn: () => attendanceService.getAll({ search: dSearch, page, size, date: dateFilter, status: statusFilter }).then(r => r.data),
    retry: 1,
  })

  const records = data?.content || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input value={search} onChange={onSearchChange} placeholder="Search by name..." className="input pl-9" />
        </div>
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-auto" />
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          options={['PRESENT','ABSENT','HALF_DAY','LEAVE'].map(v => ({ value: v, label: v.replace('_', ' ') }))}
          placeholder="All Status"
          className="w-auto"
        />
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
                <th className="table-header text-left">Total Hours</th>
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
                    <div className="flex items-center gap-3">
                      <Avatar name={r.employeeName} size="sm" />
                      <p className="text-sm font-medium text-[var(--text-primary)]">{r.employeeName || '—'}</p>
                    </div>
                  </td>
                  <td className="table-cell text-[var(--text-secondary)]">{formatDate(r.date)}</td>
                  <td className="table-cell text-sm">{r.checkIn || '—'}</td>
                  <td className="table-cell text-sm">{r.checkOut || '—'}</td>
                  <td className="table-cell text-sm">{r.totalHours ? `${r.totalHours}h` : '—'}</td>
                  <td className="table-cell">
                    <Badge className={getStatusColor(r.status)}>{r.status?.replace('_', ' ')}</Badge>
                  </td>
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
