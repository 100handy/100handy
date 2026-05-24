import { useEffect } from 'react'

export function useUnsavedChangesWarning(enabled: boolean, message = 'You have unsaved changes. Are you sure you want to leave this page?') {
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled, message])
}
