export declare const COOKIE_CONSENT_STORAGE_KEY = "soduko_cookie_consent_v1";
export type StoredCookieConsent = 'accepted' | 'rejected';
declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}
export declare function readStoredConsent(): StoredCookieConsent | null;
export declare function writeStoredConsent(value: StoredCookieConsent): void;
/** Apply Google Consent Mode update (gtag must exist — loaded from index.html). */
export declare function applyGtagConsent(acceptAnalytics: boolean): void;
export declare function persistAndApplyConsent(value: StoredCookieConsent): void;
/** Re-send config after consent grant so GA picks up storage (recommended when default was denied). */
export declare function refreshGaConfig(): void;
