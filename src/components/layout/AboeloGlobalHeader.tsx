import React, { useState } from 'react';

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Menu: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MENU_DATA = [
  {
    title: 'Wohnen im Alter',
    href: 'https://aboelo.de/wohnen-im-alter/',
    items: [
      { label: 'Barrierefreies Wohnen', href: 'https://aboelo.de/wohnen-im-alter/barrierefreies-wohnen/' },
      { label: 'Betreutes Wohnen', href: 'https://aboelo.de/wohnen-im-alter/betreutes-wohnen/' },
      { label: 'Hausnotruf', href: 'https://aboelo.de/wohnen-im-alter/hausnotruf-notfallknopf/' },
      { label: 'Pflege-WG', href: 'https://aboelo.de/wohnen-im-alter/pflege-wg/' },
      { label: 'Seniorenresidenz', href: 'https://aboelo.de/pflege-betreuung/seniorenwohnheim/' },
      { label: 'Mehrgenerationenhaus', href: 'https://aboelo.de/wohnen-im-alter/mehrgenerationenhaus/' },
      { label: 'Smart Home für Senioren', href: 'https://aboelo.de/wohnen-im-alter/aal-assisted-ambient-living/' },
    ]
  },
  {
    title: 'Pflege & Betreuung',
    href: 'https://aboelo.de/pflege-betreuung/',
    items: [
      { label: 'Ambulante Pflege', href: 'https://aboelo.de/pflege-betreuung/ambulante-pflege/' },
      { label: 'Tagespflege', href: 'https://aboelo.de/pflege-betreuung/tagespflege/' },
      { label: 'Intensivpflege', href: 'https://aboelo.de/pflege-betreuung/intensivpflege/' },
      { label: 'Verhinderungspflege', href: 'https://aboelo.de/pflege-betreuung/verhinderungspflege/' },
      { label: '24-Stunden-Pflege zu Hause', href: 'https://aboelo.de/pflege-betreuung/24-stunden-pflege-zu-hause/' },
      { label: '24-Stunden-Pflege Kosten', href: 'https://aboelo.de/pflege-betreuung/24-stunden-pflege-kosten-finanzierung-eigenanteil/' },
      { label: '24-Stunden-Pflege organisieren', href: 'https://aboelo.de/pflege-betreuung/24-stunden-pflege-organisieren/' },
      { label: 'Pflegeberatung', href: 'https://aboelo.de/pflege-betreuung/pflegeberatung/' },
      { label: 'Pflegeantrag & Pflegegrad', href: 'https://aboelo.de/pflegeantrag/' },
      { label: 'Pflegegrad-Rechner', href: 'https://aboelo.de/pflegegrad-rechner/' },
      { label: 'Pflegekosten-Rechner', href: 'https://aboelo.de/pflegekosten-rechner/' },
    ]
  },
  {
    title: 'Gesundheit & Fitness',
    href: 'https://aboelo.de/gesundheit-fitness/',
    items: [
      { label: 'Hilfsmittel finden', href: 'https://aboelo.de/hilfsmittel/' },
      { label: 'Fitness für Senioren App', href: 'https://aboelo.de/fitness/' },
      { label: 'Digital Quiz', href: 'https://aboelo.de/quiz/' },
      { label: 'Digitale Kompetenz', href: 'https://aboelo.de/digital/' },
      { label: 'Sudoku spielen', href: 'https://aboelo.de/sudoku/' },
      { label: 'Vorsorge im Alter', href: 'https://aboelo.de/vorsorge-im-alter/' },
      { label: 'Sport im Alter', href: 'https://aboelo.de/sport-im-alter/' },
    ]
  },
  {
    title: 'Finanzen & Recht',
    href: 'https://aboelo.de/finanzen-recht/',
    items: [
      { label: 'Erbrecht', href: 'https://aboelo.de/finanzen-recht/erben-erbschaft-erbschaftsrecht/' },
      { label: 'Pflegerecht', href: 'https://aboelo.de/finanzen-recht/pflegerecht/' },
      { label: 'Rentenlücke-Rechner', href: 'https://aboelo.de/rentenlueckenrechner/' },
    ]
  }
];

interface HeaderProps {
  logoPath?: string;
}

export const AboeloGlobalHeader: React.FC<HeaderProps> = ({ logoPath = '/aboeloLogo.png' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveMobileSubmenu(null);
  };

  const toggleMobileSubmenu = (index: number) => {
    setActiveMobileSubmenu(activeMobileSubmenu === index ? null : index);
  };

  return (
    <nav className="bg-white border-b border-gray-200 w-full relative z-[1000] font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="https://aboelo.de" className="flex items-center">
              <img
                src={logoPath}
                alt="aboelo Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const nextNode = target.nextSibling as HTMLElement;
                  if (nextNode) nextNode.style.display = 'block';
                }}
              />
              <span className="hidden font-bold text-2xl text-teal-800 tracking-wide" style={{ display: 'none' }}>
                aboelo
              </span>
            </a>
          </div>

          {/* Desktop Dropdown Menus */}
          <div className="hidden md:flex items-center gap-2">
            {MENU_DATA.map((menu, index) => (
              <div key={index} className="relative group">
                <a
                  href={menu.href}
                  className="inline-flex items-center gap-1 px-4 py-2 text-[15px] font-semibold text-gray-700 hover:text-teal-800 transition-colors"
                >
                  {menu.title}
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-teal-800 transition-transform group-hover:rotate-180" />
                </a>

                {/* Dropdown Card */}
                <div className="absolute left-0 mt-0 w-64 bg-white shadow-xl border border-gray-100 rounded-lg py-2 hidden group-hover:block z-[9999] transition-all">
                  {menu.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-teal-800 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-3 shadow-lg absolute top-20 left-0 w-full z-[1000] px-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {MENU_DATA.map((menu, index) => {
              const isSubOpen = activeMobileSubmenu === index;
              return (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-1">
                  <button
                    onClick={() => toggleMobileSubmenu(index)}
                    className="flex w-full items-center justify-between py-3 px-2 text-[16px] font-semibold text-gray-800 hover:text-teal-800"
                  >
                    <span>{menu.title}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isSubOpen ? 'rotate-180 text-teal-800' : ''}`} />
                  </button>
                  {isSubOpen && (
                    <div className="bg-gray-50 rounded-lg py-1 px-3 mt-1 space-y-1">
                      {menu.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.href}
                          className="block py-2.5 px-2 text-sm text-gray-600 hover:text-teal-900 hover:bg-teal-50 rounded-md transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
