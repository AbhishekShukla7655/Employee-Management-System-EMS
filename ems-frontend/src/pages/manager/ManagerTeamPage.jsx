import { useQuery } from '@tanstack/react-query'
import { Users, Mail, Phone } from 'lucide-react'
import { managerService } from '../../services/api'
import Avatar from '../../components/common/Avatar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { formatDate } from '../../utils/helpers'

export default function ManagerTeamPage() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['manager-team'],
    queryFn: () => managerService.getTeam().then(r => r.data),
    retry: 1,
  })

  if (isLoading) return <LoadingSpinner />

  const members = team || []

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Users size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">My Team</p>
          <p className="text-xs text-[var(--text-secondary)]">{members.length} members</p>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState title="No team members" description="Your team will appear here once employees are assigned." icon={Users} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="card p-5 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={`${m.firstName} ${m.lastName}`} src={m.profileImageUrl} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{m.firstName} {m.lastName}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{m.designation || 'Employee'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Mail size={12} className="flex-shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                {m.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Phone size={12} className="flex-shrink-0" />
                    <span>{m.phoneNumber}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Department</p>
                  <p className="text-xs font-medium text-[var(--text-primary)] mt-0.5 truncate">{m.department || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Joined</p>
                  <p className="text-xs font-medium text-[var(--text-primary)] mt-0.5">{formatDate(m.joiningDate, 'MMM yyyy')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
