import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'
import type { Difficulty } from '@/lib/sudoku/types'

const difficulties: Difficulty[] = ['leicht', 'mittel', 'schwer', 'meister']
const fontScales = [1, 1.2, 1.4]

export function ControlPanel() {
  const { t } = useTranslation()
  const {
    mode,
    difficulty,
    setMode,
    setDifficulty,
    newRandomPuzzle,
    loadDailyPuzzle,
    noteMode,
    toggleNoteMode,
    highlightErrors,
    toggleHighlightErrors,
    highContrast,
    toggleHighContrast,
    fontScale,
    setFontScale,
    requestHint,
    resetBoard,
    selectedCell,
    setCellValue,
    toggleNote,
    clearNotes,
    loading,
    hasUserInput,
  } = useSudokuStore(
    useShallow((state: SudokuState) => ({
      mode: state.mode,
      difficulty: state.difficulty,
      setMode: state.setMode,
      setDifficulty: state.setDifficulty,
      newRandomPuzzle: state.newRandomPuzzle,
      loadDailyPuzzle: state.loadDailyPuzzle,
      noteMode: state.noteMode,
      toggleNoteMode: state.toggleNoteMode,
      highlightErrors: state.highlightErrors,
      toggleHighlightErrors: state.toggleHighlightErrors,
      highContrast: state.highContrast,
      toggleHighContrast: state.toggleHighContrast,
      fontScale: state.fontScale,
      setFontScale: state.setFontScale,
      requestHint: state.requestHint,
      resetBoard: state.resetBoard,
      selectedCell: state.selectedCell,
      setCellValue: state.setCellValue,
      toggleNote: state.toggleNote,
      clearNotes: state.clearNotes,
      loading: state.loading,
      hasUserInput: state.hasUserInput,
    })),
  )

  const [confirmOpen, setConfirmOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null)

  const requestConfirmation = (action: () => void) => {
    if (hasUserInput) {
      pendingActionRef.current = action
      setConfirmOpen(true)
    } else {
      action()
    }
  }

  const handleConfirm = () => {
    const action = pendingActionRef.current
    setConfirmOpen(false)
    pendingActionRef.current = null
    action?.()
  }

  const handleCancel = () => {
    setConfirmOpen(false)
    pendingActionRef.current = null
  }

  useEffect(() => {
    if (confirmOpen) {
      cancelButtonRef.current?.focus()
    }
  }, [confirmOpen])

  const handleModeChange = (nextMode: typeof mode) => {
    if (nextMode === mode) {
      return
    }
    requestConfirmation(() => setMode(nextMode))
  }

  const handleDifficultyChange = (value: Difficulty) => {
    if (value === difficulty) {
      return
    }
    requestConfirmation(() => setDifficulty(value))
  }

  const handleNewGame = () => {
    requestConfirmation(() => (mode === 'daily' ? loadDailyPuzzle(difficulty) : newRandomPuzzle(difficulty)))
  }

  const handleNumberInput = (value: number) => {
    if (!selectedCell) {
      return
    }
    if (noteMode) {
      toggleNote(selectedCell, value)
    } else {
      setCellValue(selectedCell, value)
    }
  }

  const handleClear = () => {
    if (!selectedCell) {
      return
    }
    clearNotes(selectedCell)
    setCellValue(selectedCell, null)
  }

  return (
    <aside className="rounded-3xl bg-white/90 p-4 shadow-panel" aria-label={t('controlsHeading')}>
      <div className="space-y-6 text-sm">
        <section aria-labelledby="number-pad-heading" className="space-y-3">
          <header>
            <h2 id="number-pad-heading" className="text-lg font-semibold text-neutral-800">
              {t('numberPadHeading')}
            </h2>
            <p className="text-sm text-neutral-600">{t('numberPadDescription')}</p>
          </header>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label={t('numberPadHeading')}>
            {Array.from({ length: 9 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                className="rounded-2xl border-2 border-neutral-200 px-3 py-3 text-2xl font-semibold text-neutral-800 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => handleNumberInput(value)}
                disabled={loading}
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              className="col-span-3 rounded-2xl bg-danger px-3 py-3 text-lg font-semibold text-white transition hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={handleClear}
              disabled={loading}
            >
              {t('clearAction')}
            </button>
            <button
              type="button"
              className="col-span-3 rounded-2xl bg-success px-3 py-3 text-lg font-semibold text-white transition hover:bg-success/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={requestHint}
              disabled={loading}
            >
              {t('hintAction')}
            </button>
          </div>
          <p className="text-xs text-neutral-500">{t('hintDescription')}</p>
        </section>

        <section aria-labelledby="mode-heading" className="space-y-3">
          <header>
            <h2 id="mode-heading" className="text-lg font-semibold text-neutral-800">
              {t('modeDescription')}
            </h2>
            <p className="text-sm text-neutral-600">{t('difficultyHelper')}</p>
          </header>
          <div className="grid gap-2" role="group" aria-label={t('modeDescription')}>
            {(['daily', 'random'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleModeChange(option)}
                className={clsx(
                  'rounded-2xl border-2 px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  option === mode ? 'border-brand-500 bg-brand-50 text-brand-900' : 'border-neutral-200 bg-white',
                )}
              >
                <span className="block text-base font-semibold">
                  {t(`mode.${option}`)}
                </span>
              </button>
            ))}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-neutral-700">{t('chooseDifficulty')}</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {difficulties.map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={value}
                    className="sr-only"
                    checked={difficulty === value}
                    onChange={() => handleDifficultyChange(value)}
                  />
                  <div
                    className={clsx(
                      'rounded-2xl border-2 px-3 py-2 text-center text-base font-medium transition',
                      'focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300 focus-within:ring-offset-2 focus-within:ring-offset-white',
                      difficulty === value ? 'border-brand-500 bg-brand-50 text-brand-900' : 'border-neutral-200 bg-white',
                    )}
                  >
                    {t(`difficulty.${value}`)}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-neutral-500">{t('selectedDifficulty', { difficulty: t(`difficulty.${difficulty}`) })}</p>
          </fieldset>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-2xl bg-brand-600 px-3 py-2 text-base font-semibold text-white shadow-lg transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={handleNewGame}
              disabled={loading}
            >
              {mode === 'daily' ? t('dailyChallenge') : t('newGame')}
            </button>
            <button
              type="button"
              className="rounded-2xl border-2 border-neutral-200 px-3 py-2 text-base font-semibold text-neutral-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={resetBoard}
              disabled={loading}
            >
              {t('clearCell')}
            </button>
          </div>
        </section>

        <section aria-labelledby="assist-heading" className="space-y-3">
          <h2 id="assist-heading" className="text-lg font-semibold text-neutral-800">
            {t('controlsHeading')}
          </h2>
          <div className="grid gap-2">
            <ToggleRow
              label={t('noteMode')}
              description={t('noteModeDescription')}
              checked={noteMode}
              onChange={toggleNoteMode}
            />
            <ToggleRow
              label={t('highlightErrors')}
              description={t('highlightErrorsDescription')}
              checked={highlightErrors}
              onChange={toggleHighlightErrors}
            />
            <ToggleRow
              label={t('highContrast')}
              description={t('highContrastDescription')}
              checked={highContrast}
              onChange={toggleHighContrast}
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-neutral-700">{t('fontSize')}</legend>
            <div className="flex gap-2" role="radiogroup">
              {fontScales.map((scale) => (
                <label key={scale} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="font-scale"
                    value={scale}
                    className="sr-only"
                    checked={fontScale === scale}
                    onChange={() => setFontScale(scale)}
                  />
                  <div
                    className={clsx(
                      'rounded-2xl border-2 px-3 py-2 text-center transition',
                      'focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300 focus-within:ring-offset-2 focus-within:ring-offset-white',
                      fontScale === scale ? 'border-brand-500 bg-brand-50 text-brand-900' : 'border-neutral-200 bg-white',
                    )}
                  >
                    {scale === 1 ? t('fontSizeNormal') : scale === 1.2 ? t('fontSizeLarge') : t('fontSizeExtra')}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </section>
      </div>
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-reset-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="space-y-3 text-center">
              <h2 id="confirm-reset-title" className="text-2xl font-semibold text-neutral-900">
                {t('confirmResetTitle')}
              </h2>
              <p className="text-sm text-neutral-600">{t('confirmResetBody')}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-2xl border-2 border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={handleCancel}
                ref={cancelButtonRef}
              >
                {t('confirmResetCancel')}
              </button>
              <button
                type="button"
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={handleConfirm}
              >
                {t('confirmResetConfirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 p-3">
      <div>
        <p className="text-base font-semibold text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-600">{description}</p>
      </div>
      <label className="inline-flex cursor-pointer items-center">
        <span className="sr-only">{label}</span>
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onChange}
        />
        <span className="h-6 w-11 rounded-full bg-neutral-300 transition peer-checked:bg-brand-500">
          <span className={clsx('ml-1 mt-1 block h-4 w-4 rounded-full bg-white transition', checked && 'translate-x-5')} />
        </span>
      </label>
    </div>
  )
}
