import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

export function AdsPlaceholder() {
  const { t } = useTranslation()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID

  useEffect(() => {
    if (!clientId || !slotId || typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const existingScript = document.querySelector(`script[src="${ADSENSE_SRC}"]`)
    const appendAd = () => {
      if (!containerRef.current) {
        return
      }
      try {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        setScriptLoaded(true)
      } catch (error) {
        console.error('AdSense push failed', error)
      }
    }

    if (!existingScript) {
      const script = document.createElement('script')
      script.setAttribute('async', 'true')
      script.src = ADSENSE_SRC
      script.onload = appendAd
      script.onerror = () => setScriptLoaded(false)
      document.head.appendChild(script)
    } else {
      appendAd()
    }
  }, [clientId, slotId])

  if (!clientId || !slotId) {
    return (
      <section className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-6 shadow-inner">
        <h2 className="text-lg font-semibold text-neutral-800">{t('adsPlaceholderTitle')}</h2>
        <p className="mt-2 text-sm text-neutral-600">{t('adsPlaceholderBody')}</p>
        <p className="mt-4 text-xs text-neutral-500">{t('adsInfo')}</p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-panel" aria-label="Werbung">
      <div ref={containerRef}>
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        {!scriptLoaded && (
          <p className="mt-2 text-xs text-neutral-500" role="status">
            {t('loading')}
          </p>
        )}
      </div>
    </section>
  )
}
