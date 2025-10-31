import { useEffect, useState } from 'react'

export function RotatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Show prompt on tablet-sized devices (768px - 1024px) in portrait mode
      const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      setShowPrompt(isTablet && isPortrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/95 p-6">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-600"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M7 15h10" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-neutral-900">
          Drehen Sie Ihr Gerät
        </h2>
        <p className="text-base text-neutral-600">
          Für ein besseres Spielerlebnis nutzen Sie bitte den Querformat-Modus
        </p>
      </div>
    </div>
  )
}
