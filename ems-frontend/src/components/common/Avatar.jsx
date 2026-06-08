import { getInitials } from '../../utils/helpers'

const sizeMap = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
}

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizeClass = sizeMap[size] || sizeMap.md

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-[var(--border)] ${className}`}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
    )
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-500 to-violet-600
      flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  )
}
