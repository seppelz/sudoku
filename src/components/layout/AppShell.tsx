import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'
import { Header } from './Header'
import { Footer } from './Footer'

interface AppShellProps {
  headline: string
  subheadline: string
  instructions: string
  ariaLabel: string
  children: ReactNode
}

export function AppShell({ headline, subheadline, instructions, ariaLabel, children }: AppShellProps) {
  const { highContrast, fontScale } = useSudokuStore(
    useShallow((state: SudokuState) => ({
      highContrast: state.highContrast,
      fontScale: state.fontScale,
    })),
  )
  const { t } = useTranslation()
  const [helpOpen, setHelpOpen] = useState(false)
  const helpDialogId = 'help-dialog'
  const helpTitleId = 'help-dialog-title'
  const helpSteps = t('helpDialogSteps', { returnObjects: true }) as string[]
  const helpRules = t('helpDialogRules', { returnObjects: true }) as string[]

  useEffect(() => {
    if (!helpOpen) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHelpOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [helpOpen])
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale))
  }, [fontScale])
  const instructionsId = 'sudoku-instructions'

  return (
    <div
      className={clsx(
        'min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-100 to-brand-50 text-neutral-900 transition-colors',
        highContrast && 'from-white via-white to-white text-black',
      )}
    >
      <Header />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-2 py-4 sm:gap-8 sm:px-6 sm:py-10 lg:px-8" style={{ fontSize: `${fontScale}rem` }}>
        <div className="rounded-3xl bg-[#2E797C] px-4 py-4 text-center text-white shadow-lg sm:px-6 sm:py-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {headline}
            </h1>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white shadow-lg transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E797C] sm:h-12 sm:w-12 sm:text-2xl"
              aria-haspopup="dialog"
              aria-expanded={helpOpen}
              aria-controls={helpDialogId}
              onClick={() => setHelpOpen(true)}
            >
              <span className="sr-only">{t('helpButtonLabel')}</span>
              <span aria-hidden="true">?</span>
            </button>
          </div>
          <p className="mt-2 text-base text-white/80 sm:mt-4 sm:text-xl" aria-live="polite">
            {subheadline}
          </p>
        </div>
        <main
          className="rounded-3xl bg-white/90 p-2 shadow-panel backdrop-blur sm:p-4 md:p-8"
          aria-label={ariaLabel}
          aria-describedby={instructionsId}
        >
          <p id={instructionsId} className="mb-6 hidden text-base text-neutral-700 sm:block">
            {instructions}
          </p>
          {children}
        </main>
      </div>
      <Footer />
      {helpOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 px-4"
          onClick={() => setHelpOpen(false)}
        >
          <div
            id={helpDialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={helpTitleId}
            className="w-full max-w-xl rounded-3xl bg-white p-6 text-left shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={helpTitleId} className="text-2xl font-semibold text-neutral-900">
                  {t('helpDialogTitle')}
                </h2>
                <p className="mt-2 text-neutral-600">{t('helpDialogIntro')}</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => setHelpOpen(false)}
              >
                {t('helpDialogClose')}
              </button>
            </div>
            <div className="mt-4 space-y-4 text-neutral-700">
              {helpRules.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">{t('helpDialogRulesTitle')}</h3>
                  <ul className="mt-2 space-y-2">
                    {helpRules.map((rule, index) => (
                      <li key={`rule-${index}`} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                          {index + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{t('helpDialogStepsTitle')}</h3>
                <ul className="mt-2 space-y-2">
                  {helpSteps.map((step, index) => (
                    <li key={`step-${index}`} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
