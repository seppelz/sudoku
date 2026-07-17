import { GA_MEASUREMENT_ID } from './measurementId'

export const COOKIE_CONSENT_STORAGE_KEY = 'soduko_cookie_consent_v1'

export type StoredCookieConsent = 'accepted' | 'rejected'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function readStoredConsent(): StoredCookieConsent | null {
  try {
    // 1. Check local storage (both keys and formats)
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (raw === 'accepted' || raw === 'all') return 'accepted';
    if (raw === 'rejected' || raw === 'necessary') return 'rejected';

    const rawAboelo = localStorage.getItem('aboelo_cookie_consent');
    if (rawAboelo === 'accepted' || rawAboelo === 'all') {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
      return 'accepted';
    }
    if (rawAboelo === 'rejected' || rawAboelo === 'necessary') {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'rejected');
      return 'rejected';
    }

    // 2. Check cookies
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith('rcb-consent=')) {
        const cookieValue = decodeURIComponent(c.substring('rcb-consent='.length));
        if (cookieValue.includes('"statistics":true') || cookieValue.includes('"analytics":true') || cookieValue.includes('"statistics-optin":true')) {
          localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
          localStorage.setItem('aboelo_cookie_consent', 'accepted');
          return 'accepted';
        } else if (cookieValue.includes('"statistics":false') || cookieValue.includes('"analytics":false') || cookieValue.includes('"statistics-optin":false')) {
          localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'rejected');
          localStorage.setItem('aboelo_cookie_consent', 'rejected');
          return 'rejected';
        }
      }
      if (c.startsWith('aboelo_cookie_consent=')) {
        const sharedValue = c.substring('aboelo_cookie_consent='.length).trim();
        if (sharedValue === 'accepted' || sharedValue === 'all') {
          localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
          localStorage.setItem('aboelo_cookie_consent', 'accepted');
          return 'accepted';
        } else if (sharedValue === 'rejected' || sharedValue === 'necessary') {
          localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'rejected');
          localStorage.setItem('aboelo_cookie_consent', 'rejected');
          return 'rejected';
        }
      }
    }
  } catch {
    /* private mode / blocked storage */
  }
  return null
}

export function writeStoredConsent(value: StoredCookieConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
    localStorage.setItem('aboelo_cookie_consent', value)
    document.cookie = `aboelo_cookie_consent=${value}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    /* ignore */
  }
}

/** Apply Google Consent Mode update (gtag must exist — loaded from index.html). */
export function applyGtagConsent(acceptAnalytics: boolean): void {
  const gtag = window.gtag
  if (typeof gtag !== 'function') {
    return
  }
  gtag('consent', 'update', {
    analytics_storage: acceptAnalytics ? 'granted' : 'denied',
  })
}

export function persistAndApplyConsent(value: StoredCookieConsent): void {
  writeStoredConsent(value)
  applyGtagConsent(value === 'accepted')
}

/** Re-send config after consent grant so GA picks up storage (recommended when default was denied). */
export function refreshGaConfig(): void {
  const gtag = window.gtag
  if (typeof gtag !== 'function') {
    return
  }
  gtag('config', GA_MEASUREMENT_ID)
}
