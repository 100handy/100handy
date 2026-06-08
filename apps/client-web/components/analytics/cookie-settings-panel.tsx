'use client';

import { useEffect, useState } from 'react';
import {
  ANALYTICS_CONSENT_EVENT,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsentState,
} from '@/lib/analytics';

export function CookieSettingsPanel() {
  const [consent, setConsent] = useState<AnalyticsConsentState>('unset');

  useEffect(() => {
    setConsent(readAnalyticsConsent());
    const syncConsent = () => setConsent(readAnalyticsConsent());
    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncConsent as EventListener);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, syncConsent as EventListener);
  }, []);

  const enabled = consent === 'granted';

  return (
    <div className="mt-10 rounded-2xl border border-[#d8c1ad] bg-[#f8efe8] p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-brand-dark-alt">Analytics cookies</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-brand-dark-alt/80">
            Allow Google Analytics to measure visits, page usage, and conversion activity. If disabled, analytics scripts will not load.
          </p>
          <p className="mt-3 text-sm text-brand-dark-alt/70">
            Current setting: <span className="font-semibold text-brand-dark-alt">{enabled ? 'Enabled' : 'Disabled'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              saveAnalyticsConsent('denied');
              setConsent('denied');
            }}
            className={`rounded-lg border px-4 py-2 font-medium ${
              !enabled ? 'border-brand-dark-alt bg-white text-brand-dark-alt' : 'border-gray-300 text-brand-dark-alt'
            }`}
          >
            Disable
          </button>
          <button
            type="button"
            onClick={() => {
              saveAnalyticsConsent('granted');
              setConsent('granted');
            }}
            className={`rounded-lg px-4 py-2 font-semibold ${
              enabled ? 'bg-brand-terracotta text-white' : 'border border-brand-terracotta text-brand-terracotta'
            }`}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}
