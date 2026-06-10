import type { ReactNode } from 'react'
import { AlertCircle, Inbox, Loader2, RotateCcw } from 'lucide-react'

interface AdminStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function AdminLoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-gray-900/50">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>{label}</span>
      </div>
    </div>
  )
}

export function AdminEmptyState({ title, description, action }: AdminStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-gray-900/50">
      <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-700" />
      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function AdminErrorState({
  title = 'Failed to load data',
  description,
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {description ? <p className="mt-1 text-sm">{description}</p> : null}
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
