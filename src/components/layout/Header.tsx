import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation()

  const navItems = [
    { label: 'Zu Aboelo', href: 'https://aboelo.de' },
    { label: 'Fitness', href: 'https://fitness.aboelo.de' },
    { label: 'Hilfsmittel-Finder', href: 'https://hilfsmittel.aboelo.de' },
  ]

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <img
              src="/aboeloLogo.png"
              alt="Aboelo Logo"
              className="h-10 w-auto sm:h-12"
            />
            <span className="text-xl font-semibold text-neutral-900 sm:text-2xl">
              Sudoku
            </span>
          </div>

          {/* Navigation */}
          <nav aria-label={t('mainNavLabel', 'Main navigation')}>
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-medium text-neutral-700 transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
