import { useTranslation } from 'react-i18next'

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export function Header() {
  const { t } = useTranslation()

  const appsLinks = [
    { label: 'Digital', href: 'https://digital.aboelo.de' },
    { label: 'Fitness', href: 'https://fitness.aboelo.de' },
    { label: 'Sudoku', href: 'https://sudoku.aboelo.de' },
    { label: 'Post', href: 'https://post.aboelo.de' },
    { label: 'Senioren-Rechner', href: 'https://aboelo.de/senioren-rechner' },
    { label: 'Hilfsmittel-Finder', href: 'https://hilfsmittel.aboelo.de' },
  ]

  return (
    <header className="bg-white shadow-md">
      {/* Top App Bar */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="mx-auto max-w-6xl px-2 py-1.5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-x-6 gap-y-2 text-xs sm:text-sm">
            <span className="text-neutral-500 font-medium">{t('aboeloApps', 'aboelo Apps:')}</span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2">
              {appsLinks.map((app) => {
                const isCurrent = app.label === 'Sudoku'
                return (
                  <a
                    key={app.href}
                    href={app.href}
                    className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                      isCurrent
                        ? 'text-[#086b6a] cursor-default'
                        : 'text-[#086b6a] hover:text-teal-900 opacity-80 hover:opacity-100'
                    }`}
                    {...(!isCurrent ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {app.label}
                    {!isCurrent && <ExternalLinkIcon className="h-3 w-3" />}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-2 py-2 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="https://aboelo.de" className="flex-shrink-0">
              <img
                src="/aboeloLogo.png"
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
