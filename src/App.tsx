import { Suspense, useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useSudokuStore } from './store/useSudokuStore'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { AppShell } from './components/layout/AppShell'
import { SudokuBoard } from './components/board/SudokuBoard'
import { ControlPanel } from './components/panel/ControlPanel'
import { Announcement } from './components/a11y/Announcement'
import { AdsPlaceholder } from './components/ads/AdsPlaceholder'
import { DailyStatus } from './components/panel/DailyStatus'

function App() {
  const { t } = useTranslation()
  const { loadDailyPuzzle, puzzle, loading } = useSudokuStore(
    useShallow((state) => ({
      loadDailyPuzzle: state.loadDailyPuzzle,
      puzzle: state.puzzle,
      loading: state.loading,
    })),
  )

  useKeyboardNavigation()

  useEffect(() => {
    if (!puzzle) {
      loadDailyPuzzle('leicht')
    }
  }, [puzzle, loadDailyPuzzle])

  return (
    <Suspense fallback={<div className="p-6 text-lg">{t('loading')}</div>}>
      <a href="#main" className="sr-only sr-only-focusable">
        {t('skipToContent')}
      </a>
      <AppShell
        headline={t('title')}
        subheadline={t('subtitle')}
        instructions={t('boardInstructions')}
        ariaLabel={t('boardLabel')}
      >
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]" id="main">
          <div className="space-y-6">
            <SudokuBoard loading={loading} />
            <DailyStatus />
          </div>
          <div className="space-y-6">
            <ControlPanel />
            <AdsPlaceholder />
          </div>
        </div>
        <Announcement />
      </AppShell>
    </Suspense>
  )
}

export default App
