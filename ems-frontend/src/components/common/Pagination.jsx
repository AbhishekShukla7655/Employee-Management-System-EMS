import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPrev, onNext, onGoTo }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(0, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages - 1, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {start > 0 && (
        <>
          <button onClick={() => onGoTo(0)} className="w-8 h-8 rounded-lg text-xs hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">1</button>
          {start > 1 && <span className="text-[var(--text-secondary)] text-xs px-1">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
            p === page
              ? 'bg-primary-600 text-white'
              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
          }`}
        >
          {p + 1}
        </button>
      ))}

      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span className="text-[var(--text-secondary)] text-xs px-1">...</span>}
          <button onClick={() => onGoTo(totalPages - 1)} className="w-8 h-8 rounded-lg text-xs hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">{totalPages}</button>
        </>
      )}

      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
