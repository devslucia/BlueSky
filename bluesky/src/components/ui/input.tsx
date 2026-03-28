import * as React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-11 w-full rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm placeholder:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
