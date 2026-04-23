import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  applyGtagConsent,
  readStoredConsent,
  persistAndApplyConsent,
  refreshGaConfig,
  type StoredCookieConsent,
} from '@/analytics/consent'

const PRIVACY_HREF = 'https://aboelo.de/datenschutzerklaerung'

export function CookieConsentSync() {
  useEffect(() => {
    const stored = readStoredConsent()
    if (stored === 'accepted') {
      applyGtagConsent(true)
      refreshGaConfig()
    } else if (stored === 'rejected') {
      applyGtagConsent(false)
    }
  }, [])
  return null
}

export function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => readStoredConsent() === null)

  const choose = (value: StoredCookieConsent) => {
    persistAndApplyConsent(value)
    if (value === 'accepted') {
      refreshGaConfig()
    }
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-neutral-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur sm:p-6"
      role="region"
      aria-label={t('cookieBannerAriaLabel')}
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-2 text-neutral-800">
          <p className="text-lg font-semibold text-neutral-900">{t('cookieBannerTitle')}</p>
          <p className="text-base leading-relaxed text-neutral-700">{t('cookieBannerBody')}</p>
          <p className="text-base">
            <a
              href={PRIVACY_HREF}
              className="font-semibold text-brand-700 underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cookieBannerPrivacyLink')}
              <span className="sr-only"> ({t('cookieBannerOpensNewTab')})</span>
            </a>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="rounded-xl bg-neutral-200 px-5 py-3 text-base font-semibold text-neutral-900 transition hover:bg-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => choose('rejected')}
          >
            {t('cookieBannerReject')}
          </button>
          <button
            type="button"
            className="rounded-xl bg-brand-700 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => choose('accepted')}
          >
            {t('cookieBannerAccept')}
          </button>
        </div>
      </div>
    </div>
  )
}
