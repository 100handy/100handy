import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ADMIN_ANALYTICS_CONSENT_EVENT,
  ensureAdminAnalyticsInitialized,
  getAdminGaMeasurementId,
  getAdminGtmContainerId,
  readAdminAnalyticsConsent,
  saveAdminAnalyticsConsent,
  trackAdminPageView,
  type AdminAnalyticsConsentState,
} from '@/lib/analytics'

export default function AdminAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [consent, setConsent] = useState<AdminAnalyticsConsentState>('unset')
  const analyticsEnabled = useMemo(
    () => Boolean(getAdminGaMeasurementId() || getAdminGtmContainerId()),
    [],
  )

  useEffect(() => {
    setConsent(readAdminAnalyticsConsent())
    const syncConsent = () => setConsent(readAdminAnalyticsConsent())
    window.addEventListener(ADMIN_ANALYTICS_CONSENT_EVENT, syncConsent as EventListener)
    return () => window.removeEventListener(ADMIN_ANALYTICS_CONSENT_EVENT, syncConsent as EventListener)
  }, [])

  useEffect(() => {
    if (!analyticsEnabled || consent !== 'granted') return
    ensureAdminAnalyticsInitialized()
  }, [analyticsEnabled, consent])

  useEffect(() => {
    if (!analyticsEnabled || consent !== 'granted') return
    const query = location.search || ''
    trackAdminPageView(`${location.pathname}${query}`)
  }, [analyticsEnabled, consent, location.pathname, location.search])

  return (
    <>
      {children}
      {analyticsEnabled && consent === 'unset' ? (
        <div className="fixed inset-x-0 bottom-0 z-[120] border-t border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-slate-600 dark:text-slate-300">
              Enable analytics for admin usage and workflow tracking on this device.
              <Link to="/accounts/security" className="ml-1 font-medium text-primary hover:underline">
                Review admin settings
              </Link>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  saveAdminAnalyticsConsent('denied')
                  setConsent('denied')
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 font-medium dark:border-slate-700"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => {
                  saveAdminAnalyticsConsent('granted')
                  setConsent('granted')
                }}
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-white"
              >
                Enable analytics
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
