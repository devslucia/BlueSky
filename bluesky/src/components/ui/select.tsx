import * as React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, ...props }, ref) => {
    return (
      <select
        className={`flex h-11 w-full rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:border-navy-200 dark:bg-navy-50 dark:text-sky-100 dark:focus:ring-sky-400 dark:focus:border-sky-400 ${className}`}
        ref={ref}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = 'Select'
