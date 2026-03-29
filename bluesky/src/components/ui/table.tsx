import * as React from 'react'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className="relative w-full overflow-x-auto">
        <table
          ref={ref}
          className={`w-full caption-bottom text-sm ${className}`}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <thead ref={ref} className={`[&_tr]:border-b border-sky-100 dark:border-navy-200 ${className}`} {...props} />
    )
  }
)
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
    )
  }
)
TableBody.displayName = 'TableBody'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={`border-b border-sky-100 dark:border-navy-200 transition-colors hover:bg-sky-50 dark:hover:bg-navy-200 ${className}`}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={`h-12 px-3 md:px-4 text-left align-middle font-semibold text-sky-600 dark:text-sky-400 text-xs md:text-sm [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
      />
    )
  }
)
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`p-3 md:p-4 align-middle text-sky-800 dark:text-sky-200 text-xs md:text-sm [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
      />
    )
  }
)
TableCell.displayName = 'TableCell'
