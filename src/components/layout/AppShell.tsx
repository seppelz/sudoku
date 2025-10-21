import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'

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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8" style={{ fontSize: `${fontScale}rem` }}>
        <header className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-shadow-soft sm:text-4xl lg:text-5xl">
              {headline}
            </h1>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white shadow-lg transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-haspopup="dialog"
              aria-expanded={helpOpen}
              aria-controls={helpDialogId}
              onClick={() => setHelpOpen(true)}
            >
              <span className="sr-only">{t('helpButtonLabel')}</span>
              <span aria-hidden="true">?</span>
            </button>
          </div>
          <p className="text-lg text-neutral-600 sm:text-xl" aria-live="polite">
            {subheadline}
          </p>
        </header>
        <main
          className="rounded-3xl bg-white/90 p-4 shadow-panel backdrop-blur md:p-8"
          aria-label={ariaLabel}
          aria-describedby={instructionsId}
        >
          <p id={instructionsId} className="mb-6 text-base text-neutral-700">
            {instructions}
          </p>
          {children}
        </main>
        <footer className="rounded-3xl bg-white/70 p-4 text-sm text-neutral-600 backdrop-blur">
          {t('keyboardHelp')}
        </footer>
      </div>
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
            <ul className="mt-4 space-y-2 text-neutral-700">
              {helpSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
