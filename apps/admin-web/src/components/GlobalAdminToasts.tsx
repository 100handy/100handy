import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { subscribeToAdminToasts, type AdminToastPayload } from '@/lib/admin-toast'

type ToastItem = Required<AdminToastPayload>

const TONE_STYLES: Record<ToastItem['tone'], { wrapper: string; icon: typeof AlertCircle }> = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200',
    icon: CheckCircle2,
  },
  error: {
    wrapper: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200',
    icon: AlertCircle,
  },
  info: {
    wrapper: 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    icon: Info,
  },
}

export default function GlobalAdminToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToAdminToasts((payload) => {
      setToasts((current) => [...current, payload])
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== payload.id))
      }, 5000)
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const tone = TONE_STYLES[toast.tone]
        const Icon = tone.icon
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg ${tone.wrapper}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{toast.title}</div>
                {toast.description ? <div className="mt-1 text-sm opacity-90">{toast.description}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="rounded-md p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
