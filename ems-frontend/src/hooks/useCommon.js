import { useState, useCallback } from 'react'

export function usePagination(initialPage = 0, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)

  const nextPage = useCallback(() => setPage(p => p + 1), [])
  const prevPage = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const goToPage = useCallback((p) => setPage(p), [])
  const changeSize = useCallback((s) => { setSize(s); setPage(0) }, [])

  return { page, size, nextPage, prevPage, goToPage, changeSize }
}

export function useSearch(initialValue = '', delay = 400) {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  const handleChange = useCallback((e) => {
    const val = typeof e === 'string' ? e : e.target.value
    setValue(val)
    clearTimeout(handleChange._timer)
    handleChange._timer = setTimeout(() => setDebouncedValue(val), delay)
  }, [delay])

  return { value, debouncedValue, onChange: handleChange, reset: () => { setValue(''); setDebouncedValue('') } }
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)

  const open = useCallback((d = null) => { setData(d); setIsOpen(true) }, [])
  const close = useCallback(() => { setIsOpen(false); setTimeout(() => setData(null), 200) }, [])

  return { isOpen, data, open, close }
}

export function useConfirm() {
  const [state, setState] = useState({ isOpen: false, message: '', onConfirm: null })

  const confirm = useCallback((message, onConfirm) => {
    setState({ isOpen: true, message, onConfirm })
  }, [])

  const handleConfirm = useCallback(() => {
    state.onConfirm?.()
    setState({ isOpen: false, message: '', onConfirm: null })
  }, [state])

  const handleCancel = useCallback(() => {
    setState({ isOpen: false, message: '', onConfirm: null })
  }, [])

  return { ...state, confirm, handleConfirm, handleCancel }
}
