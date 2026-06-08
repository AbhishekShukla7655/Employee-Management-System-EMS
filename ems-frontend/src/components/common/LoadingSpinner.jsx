import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center animate-pulse-soft">
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-primary-500" />
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      </div>
    </div>
  )
}
