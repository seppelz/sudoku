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
            {/* Brand Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/sudoku/" className="text-lg font-bold text-neutral-900 sm:text-2xl hover:text-teal-800 transition-colors">
                Sudoku
              </a>
            </div>
        </div>
      </div>
    </header>
  )
}
