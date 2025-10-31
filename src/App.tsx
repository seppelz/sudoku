import { Suspense, useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { useSudokuStore } from './store/useSudokuStore'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { AppShell } from './components/layout/AppShell'
import { RotatePrompt } from './components/layout/RotatePrompt'
import { SudokuBoard } from './components/board/SudokuBoard'
import { ControlPanel } from './components/panel/ControlPanel'
import { MobileNumberPad } from './components/panel/MobileNumberPad'
import { MobileSettingsMenu } from './components/panel/MobileSettingsMenu'
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
      <RotatePrompt />
      <MobileSettingsMenu />
      <a href="#main" className="sr-only sr-only-focusable">
        {t('skipToContent')}
      </a>
      <AppShell
        headline={t('title')}
        subheadline={t('subtitle')}
        instructions={t('boardInstructions')}
        ariaLabel={t('boardLabel')}
      >
        {/* Mobile Layout */}
        <div className="lg:hidden" id="main">
          <div className="space-y-2">
            <SudokuBoard loading={loading} />
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <MobileNumberPad />
          </div>
          {/* Spacer to prevent content from being hidden behind fixed number pad */}
          <div className="h-32" />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1fr] lg:gap-8" id="main-desktop">
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
