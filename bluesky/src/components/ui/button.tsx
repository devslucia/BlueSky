import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400 shadow-lg shadow-sky-200/30',
      secondary: 'bg-sky-100 text-sky-700 hover:bg-sky-200 focus:ring-sky-300',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-lg shadow-red-200/30',
      outline: 'border-2 border-sky-200 bg-transparent hover:bg-sky-50 text-sky-600'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
