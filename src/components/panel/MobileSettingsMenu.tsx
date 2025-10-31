import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'
import type { Difficulty } from '@/lib/sudoku/types'

const difficulties: Difficulty[] = ['leicht', 'mittel', 'schwer', 'meister']

export function MobileSettingsMenu() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const {
    mode,
    difficulty,
    setMode,
    setDifficulty,
    newRandomPuzzle,
    loadDailyPuzzle,
    resetBoard,
    loading,
  } = useSudokuStore(
    useShallow((state: SudokuState) => ({
      mode: state.mode,
      difficulty: state.difficulty,
      setMode: state.setMode,
      setDifficulty: state.setDifficulty,
      newRandomPuzzle: state.newRandomPuzzle,
      loadDailyPuzzle: state.loadDailyPuzzle,
      resetBoard: state.resetBoard,
      loading: state.loading,
    })),
  )

  const handleModeChange = (nextMode: typeof mode) => {
    if (nextMode === mode) return
    setMode(nextMode)
  }

  const handleDifficultyChange = (value: Difficulty) => {
    if (value === difficulty) return
    setDifficulty(value)
  }

  const handleNewGame = () => {
    if (mode === 'daily') {
      loadDailyPuzzle(difficulty)
    } else {
      newRandomPuzzle(difficulty)
    }
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Einstellungen öffnen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6" />
          <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24" />
          <path d="M1 12h6m6 0h6" />
          <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-900/70"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Einstellungen</h2>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition hover:bg-neutral-300"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Mode Selection */}
              <section>
                <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                  {t('modeDescription')}
                </h3>
                <div className="grid gap-2">
                  {(['daily', 'random'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleModeChange(option)}
                      className={clsx(
                        'rounded-2xl border-2 px-4 py-3 text-left transition',
                        option === mode
                          ? 'border-brand-500 bg-brand-50 text-brand-900'
                          : 'border-neutral-200 bg-white',
                      )}
                    >
                      <span className="block text-base font-semibold">
                        {t(`mode.${option}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Difficulty Selection */}
              <section>
                <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                  {t('chooseDifficulty')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleDifficultyChange(value)}
                      className={clsx(
                        'rounded-2xl border-2 px-4 py-3 text-center text-base font-medium transition',
                        difficulty === value
                          ? 'border-brand-500 bg-brand-50 text-brand-900'
                          : 'border-neutral-200 bg-white',
                      )}
                    >
                      {t(`difficulty.${value}`)}
                    </button>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="grid gap-3 pt-4">
                <button
                  type="button"
                  className="rounded-2xl bg-brand-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-brand-700"
                  onClick={handleNewGame}
                  disabled={loading}
                >
                  {mode === 'daily' ? t('dailyChallenge') : t('newGame')}
                </button>
                <button
                  type="button"
                  className="rounded-2xl border-2 border-neutral-200 px-4 py-3 text-lg font-semibold text-neutral-700 transition hover:border-brand-400"
                  onClick={() => {
                    resetBoard()
                    setIsOpen(false)
                  }}
                  disabled={loading}
                >
                  {t('clearCell')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
