import { useTranslation } from 'react-i18next'
import { AboeloGlobalHeader } from './AboeloGlobalHeader'

export function Header() {
  const { t } = useTranslation()

  return (
    <>
      <AboeloGlobalHeader logoPath="/sudoku/aboeloLogo.png" />
      <header className="bg-white shadow-md">
        <div className="mx-auto max-w-6xl px-2 py-2 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="https://aboelo.de" className="flex-shrink-0">
                <img
                  src="/sudoku/aboeloLogo.png"
                  alt="Aboelo Logo"
                  className="h-8 w-auto sm:h-12"
                />
              </a>
            <span className="text-lg font-semibold text-neutral-900 sm:text-2xl">
              Sudoku
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
