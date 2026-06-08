import { InboxIcon } from 'lucide-react'

export default function EmptyState({ icon: Icon = InboxIcon, title = 'No data found', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center">
        <Icon size={28} className="text-[var(--text-secondary)]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[var(--text-primary)]">{title}</p>
        {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
