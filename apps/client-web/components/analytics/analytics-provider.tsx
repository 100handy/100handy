'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ANALYTICS_CONSENT_EVENT,
  ensureGaInitialized,
  getAnalyticsMeasurementId,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  trackPageView,
  type AnalyticsConsentState,
} from '@/lib/analytics';

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = getAnalyticsMeasurementId();
  const [consent, setConsent] = useState<AnalyticsConsentState>('unset');

  useEffect(() => {
    setConsent(readAnalyticsConsent());
    const syncConsent = () => setConsent(readAnalyticsConsent());
    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncConsent as EventListener);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, syncConsent as EventListener);
  }, []);

  useEffect(() => {
    if (!measurementId || consent !== 'granted') return;
    ensureGaInitialized(measurementId);
  }, [measurementId, consent]);

  const pageUrl = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname || '/';
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!measurementId || consent !== 'granted' || !pageUrl) return;
    trackPageView(pageUrl);
  }, [measurementId, consent, pageUrl]);

  if (!measurementId || consent !== 'unset') {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#d8c1ad] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 text-sm text-brand-dark-alt md:flex-row md:items-center md:justify-between md:px-6">
        <div className="max-w-3xl">
          We use analytics cookies to understand usage and improve the platform.
          <Link href="/cookie-settings" className="ml-1 font-semibold text-brand-terracotta hover:underline">
            Manage settings
          </Link>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              saveAnalyticsConsent('denied');
              setConsent('denied');
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-brand-dark-alt"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => {
              saveAnalyticsConsent('granted');
              setConsent('granted');
            }}
            className="rounded-lg bg-brand-terracotta px-4 py-2 font-semibold text-white"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
