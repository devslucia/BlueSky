import * as React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-sky-100 bg-white shadow-xl shadow-sky-100/50 dark:border-navy-200 dark:bg-navy-50 dark:shadow-navy-300/20 ${className}`}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-5 md:p-6 ${className}`}
        {...props}
      />
    )
  }
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-lg md:text-xl font-semibold leading-none tracking-tight text-sky-800 dark:text-sky-200 ${className}`}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-5 md:p-6 pt-0 ${className}`} {...props} />
    )
  }
)
CardContent.displayName = 'CardContent'
