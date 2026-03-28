import * as React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-sky-100 text-sky-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    outline: 'border border-sky-200 text-sky-600 bg-white'
  }
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
