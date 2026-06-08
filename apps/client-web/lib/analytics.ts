'use client';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __gaInitialized?: boolean;
  }
}

export type AnalyticsConsentState = 'granted' | 'denied' | 'unset';

const CONSENT_STORAGE_KEY = '100handy:web-analytics-consent';
export const ANALYTICS_CONSENT_EVENT = '100handy:web-analytics-consent-changed';

export function getAnalyticsMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';
}

export function readAnalyticsConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') return 'unset';
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return 'unset';
}

export function saveAnalyticsConsent(value: Exclude<AnalyticsConsentState, 'unset'>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}

export function ensureGaInitialized(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return;
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args as unknown as Record<string, unknown>);
    };
  }

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  if (!window.__gaInitialized) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });
    window.__gaInitialized = true;
  }
}

export function trackPageView(url: string, title?: string) {
  const measurementId = getAnalyticsMeasurementId();
  if (typeof window === 'undefined' || readAnalyticsConsent() !== 'granted' || !measurementId) return;
  ensureGaInitialized(measurementId);
  window.gtag?.('event', 'page_view', {
    page_location: url,
    page_path: url,
    page_title: title ?? document.title,
  });
}

export function trackAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}) {
  const measurementId = getAnalyticsMeasurementId();
  if (typeof window === 'undefined' || readAnalyticsConsent() !== 'granted' || !measurementId) return;
  ensureGaInitialized(measurementId);
  window.gtag?.('event', eventName, params);
}
