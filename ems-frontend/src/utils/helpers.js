import { format, parseISO } from 'date-fns'

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch { return '—' }
}

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const getStatusColor = (status) => {
  const map = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    PRESENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    ABSENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    HALF_DAY: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    LEAVE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return map[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
}

export const getPriorityColor = (priority) => {
  const map = {
    LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[priority] || 'bg-slate-100 text-slate-600'
}

export const getRoleColor = (role) => {
  const map = {
    ADMIN: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    MANAGER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    EMPLOYEE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  }
  return map[role] || 'bg-slate-100 text-slate-700'
}

export const buildQueryString = (params) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })
  return query.toString()
}

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const calculateAge = (dob) => {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}