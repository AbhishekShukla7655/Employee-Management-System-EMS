import { Loader2 } from 'lucide-react'

export default function Button({
  children, variant = 'primary', size = 'md', loading = false,
  leftIcon: LeftIcon, rightIcon: RightIcon, className = '', ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 rounded-xl transition-all duration-200',
  }[variant] || 'btn-primary'

  const sizeClass = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-base px-6 py-3',
  }[size] || ''

  return (
    <button
      className={`${variantClass} ${sizeClass} inline-flex items-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : LeftIcon && <LeftIcon size={15} />}
      {children}
      {RightIcon && !loading && <RightIcon size={15} />}
    </button>
  )
}
