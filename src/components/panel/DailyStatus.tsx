import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { parseISO, isValid, format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'

interface HistoryEntry {
  id: string
  label: string
  difficultyLabel: string | null
}

function safeDifficultyLabel(key: string, t: (path: string, opts?: Record<string, unknown>) => string): string | null {
  if (key === 'leicht' || key === 'mittel' || key === 'schwer' || key === 'meister') {
    return t(`difficulty.${key}`)
  }
  return null
}

export function DailyStatus() {
  const { t } = useTranslation()
  const { puzzle, completedPuzzles, completionHistory, difficulty } = useSudokuStore(
    useShallow((state: SudokuState) => ({
      puzzle: state.puzzle,
      completedPuzzles: state.completedPuzzles,
      completionHistory: state.completionHistory,
      difficulty: state.difficulty,
    })),
  )

  const dailySolved = useMemo(() => {
    if (!puzzle) {
      return false
    }
    return completedPuzzles.includes(puzzle.seed)
  }, [puzzle, completedPuzzles])

  const history = useMemo<HistoryEntry[]>(() => {
    if (completionHistory.length > 0) {
      return completionHistory.slice(0, 8).map((entry) => {
        const parsed = parseISO(entry.completedAt)
        const label = isValid(parsed) ? format(parsed, 'PPP, HH:mm', { locale: de }) : entry.completedAt
        const difficultyLabel = safeDifficultyLabel(entry.difficulty, t)
        return {
          id: entry.seed,
          label,
          difficultyLabel,
        }
      })
    }

    return completedPuzzles
      .slice(-6)
      .reverse()
      .map((seed) => {
        const [datePart, difficultyPart] = seed.split('-')
        const parsed = parseISO(datePart)
        const hasDate = isValid(parsed)
        const label = hasDate ? format(parsed, 'PPP', { locale: de }) : t('mode.random')
        const difficultyLabel = difficultyPart ? safeDifficultyLabel(difficultyPart, t) : null
        return {
          id: seed,
          label,
          difficultyLabel,
        }
      })
  }, [completionHistory, completedPuzzles, t])

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-panel" aria-live="polite">
      <header className="mb-3">
        <h2 className="text-lg font-semibold text-neutral-800">{t('statistics')}</h2>
        <p className="text-sm text-neutral-600">{t('statisticsSolved')}</p>
      </header>
      <div className="space-y-4 text-sm text-neutral-700">
        <div className="rounded-2xl border border-neutral-200 bg-white p-3">
          <p className="text-base font-semibold text-neutral-800">{t('todayStatus')}</p>
          <p className="mt-1 text-sm">
            {dailySolved ? t('todaySolved') : t('todayPending', { difficulty: t(`difficulty.${difficulty}`) })}
          </p>
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-800">{t('historyHeading')}</p>
          {history.length === 0 ? (
            <p className="mt-1 text-sm text-neutral-500">{t('statisticsPlaceholder')}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {history.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
                  <span className="block font-semibold text-neutral-800">{entry.label}</span>
                  {entry.difficultyLabel && (
                    <span className="text-xs text-neutral-500">{entry.difficultyLabel}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

