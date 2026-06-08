import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, RefreshCw } from 'lucide-react'
import { taskService } from '../../services/api'
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/helpers'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { useSearch, usePagination } from '../../hooks/useCommon'
import { useState } from 'react'

export default function EmployeeTasksPage() {
  const queryClient = useQueryClient()
  const { value: search, debouncedValue: dSearch, onChange } = useSearch()
  const { page, size, nextPage, prevPage, goToPage } = usePagination()
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-tasks', dSearch, page, statusFilter],
    queryFn: () => taskService.getMyTasks({ search: dSearch, page, size, status: statusFilter }).then(r => r.data),
    retry: 1,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['my-tasks']),
  })

  const tasks = data?.content || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input value={search} onChange={onChange} placeholder="Search tasks..." className="input pl-9" />
        </div>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          options={['PENDING','IN_PROGRESS','COMPLETED'].map(v => ({ value: v, label: v.replace('_', ' ') }))}
          placeholder="All Status"
          className="w-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3"><LoadingSpinner /></div>
        ) : tasks.length === 0 ? (
          <div className="col-span-3"><EmptyState title="No tasks assigned" description="Tasks assigned to you will appear here." /></div>
        ) : tasks.map(t => (
          <div key={t.id} className="card p-5 hover:shadow-card-hover transition-all duration-300 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-[var(--text-primary)] text-sm leading-snug">{t.title}</p>
              <Badge className={getPriorityColor(t.priority)}>{t.priority}</Badge>
            </div>
            {t.description && (
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{t.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Due: {formatDate(t.dueDate)}</span>
              <Badge className={getStatusColor(t.status)}>{t.status?.replace('_', ' ')}</Badge>
            </div>
            {t.assignedByName && (
              <p className="text-xs text-[var(--text-secondary)]">Assigned by: <span className="font-medium text-[var(--text-primary)]">{t.assignedByName}</span></p>
            )}
            {/* Status updater */}
            {t.status !== 'COMPLETED' && (
              <div className="pt-2 border-t border-[var(--border)]">
                <Select
                  value={t.status}
                  options={['PENDING','IN_PROGRESS','COMPLETED'].map(v => ({ value: v, label: v.replace('_', ' ') }))}
                  placeholder=""
                  className="text-xs"
                  onChange={e => statusMutation.mutate({ id: t.id, status: e.target.value })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} onGoTo={goToPage} />
        </div>
      )}
    </div>
  )
}
