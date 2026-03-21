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
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (raw === 'accepted' || raw === 'rejected') {
      return raw
    }
  } catch {
    /* private mode / blocked storage */
  }
  return null
}

export function writeStoredConsent(value: StoredCookieConsent): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
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
