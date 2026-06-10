import type { ReactNode } from 'react'

export function AdminTableShell({ children, minWidth = 800 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
      <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400" style={{ minWidth }}>
        {children}
      </table>
    </div>
  )
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50 text-xs uppercase text-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
      {children}
    </thead>
  )
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-background-dark">{children}</tbody>
}
