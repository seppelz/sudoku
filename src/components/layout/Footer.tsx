export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: 'Impressum', href: 'https://aboelo.de/impressum' },
    { label: 'Datenschutz', href: 'https://aboelo.de/datenschutz' },
  ]

  return (
    <footer className="bg-[#2D7D7D] py-6 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-white transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D7D7D] sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-white/80">
            © {currentYear} aboelo.de
          </div>
        </div>
      </div>
    </footer>
  )
}
