import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, leftIcon: LeftIcon, rightIcon: RightIcon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            <LeftIcon size={15} />
          </div>
        )}
        <input
          ref={ref}
          className={`input ${LeftIcon ? 'pl-9' : ''} ${RightIcon ? 'pr-9' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            <RightIcon size={15} />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
