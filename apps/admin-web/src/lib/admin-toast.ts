export type AdminToastTone = 'success' | 'error' | 'info'

export interface AdminToastPayload {
  id?: string
  tone: AdminToastTone
  title: string
  description?: string
}

const ADMIN_TOAST_EVENT = 'admin-toast'

export function emitAdminToast(payload: AdminToastPayload) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent(ADMIN_TOAST_EVENT, {
      detail: {
        id: payload.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...payload,
      },
    }),
  )
}

export function subscribeToAdminToasts(listener: (payload: Required<AdminToastPayload>) => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<Required<AdminToastPayload>>
    listener(customEvent.detail)
  }

  window.addEventListener(ADMIN_TOAST_EVENT, handler)
  return () => window.removeEventListener(ADMIN_TOAST_EVENT, handler)
}
