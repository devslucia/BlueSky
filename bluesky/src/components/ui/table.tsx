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
      <thead ref={ref} className={`[&_tr]:border-b border-sky-100 ${className}`} {...props} />
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
        className={`border-b border-sky-100 transition-colors hover:bg-sky-50 ${className}`}
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
        className={`h-12 px-3 md:px-4 text-left align-middle font-semibold text-sky-600 text-xs md:text-sm [&:has([role=checkbox])]:pr-0 ${className}`}
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
        className={`p-3 md:p-4 align-middle text-sky-800 text-xs md:text-sm [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
      />
    )
  }
)
TableCell.displayName = 'TableCell'
