import { AlertTriangle } from 'lucide-react'

export function UnsavedChangesBanner({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>You have unsaved changes in this editor.</span>
      </div>
    </div>
  )
}
