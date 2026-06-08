declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __adminGaInitialized?: boolean;
    __adminGtmInitialized?: boolean;
  }
}

export type AdminAnalyticsConsentState = 'granted' | 'denied' | 'unset';

const CONSENT_STORAGE_KEY = '100handy:admin-analytics-consent';
export const ADMIN_ANALYTICS_CONSENT_EVENT = '100handy:admin-analytics-consent-changed';

export function getAdminGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || '';
}

export function getAdminGtmContainerId() {
  return import.meta.env.VITE_GTM_CONTAINER_ID?.trim() || '';
}

export function readAdminAnalyticsConsent(): AdminAnalyticsConsentState {
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return 'unset';
}

export function saveAdminAnalyticsConsent(value: Exclude<AdminAnalyticsConsentState, 'unset'>) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(ADMIN_ANALYTICS_CONSENT_EVENT, { detail: value }));
}

function ensureDataLayer() {
  if (!window.dataLayer) window.dataLayer = [];
}

export function ensureAdminAnalyticsInitialized() {
  const measurementId = getAdminGaMeasurementId();
  const gtmId = getAdminGtmContainerId();
  ensureDataLayer();

  if (measurementId) {
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args as unknown as Record<string, unknown>);
      };
    }
    if (!document.getElementById('admin-ga4-script')) {
      const script = document.createElement('script');
      script.id = 'admin-ga4-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
    if (!window.__adminGaInitialized) {
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false,
        anonymize_ip: true,
      });
      window.__adminGaInitialized = true;
    }
  }

  if (gtmId && !window.__adminGtmInitialized) {
    const script = document.createElement('script');
    script.id = 'admin-gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);
    window.dataLayer.push({ event: 'gtm.js', 'gtm.start': Date.now() });
    window.__adminGtmInitialized = true;
  }
}

export function trackAdminPageView(path: string) {
  if (readAdminAnalyticsConsent() !== 'granted') return;
  ensureAdminAnalyticsInitialized();
  const measurementId = getAdminGaMeasurementId();
  if (measurementId) {
    window.gtag?.('event', 'page_view', {
      page_location: path,
      page_path: path,
      page_title: document.title,
    });
  }
  window.dataLayer.push({ event: 'admin_page_view', page_path: path });
}

export function trackAdminEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (readAdminAnalyticsConsent() !== 'granted') return;
  ensureAdminAnalyticsInitialized();
  const measurementId = getAdminGaMeasurementId();
  if (measurementId) {
    window.gtag?.('event', eventName, params);
  }
  window.dataLayer.push({ event: eventName, ...params });
}
