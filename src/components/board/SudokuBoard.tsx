import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSudokuStore } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'
import type { Coordinate } from '@/lib/sudoku/types'
import './SudokuBoard.css'

interface SudokuBoardProps {
  loading: boolean
}

const gridIndices = Array.from({ length: 9 }, (_, index) => index)

export function SudokuBoard({ loading }: SudokuBoardProps) {
  const { t } = useTranslation()
  const {
    puzzle,
    currentBoard,
    notes,
    selectedCell,
    selectCell,
    highlightErrors,
    incorrectCells,
    highContrast,
    statusMessage,
    resetStatus,
    lastCompletedSeed,
  } =
    useSudokuStore(
      useShallow((state) => ({
        puzzle: state.puzzle,
        currentBoard: state.currentBoard,
        notes: state.notes,
        selectedCell: state.selectedCell,
        selectCell: state.selectCell,
        highlightErrors: state.highlightErrors,
        incorrectCells: state.incorrectCells,
        highContrast: state.highContrast,
        statusMessage: state.statusMessage,
        resetStatus: state.setStatusMessage,
        lastCompletedSeed: state.lastCompletedSeed,
      })),
    )
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [celebratedSeed, setCelebratedSeed] = useState<string | null>(null)

  useEffect(() => {
    if (puzzle && !selectedCell) {
      selectCell({ row: 0, col: 0 })
    }
  }, [puzzle, selectedCell, selectCell])

  useEffect(() => {
    if (!lastCompletedSeed || celebratedSeed === lastCompletedSeed) {
      return
    }

    setConfettiPieces(generateConfettiPieces())
    setShowConfetti(true)
    setCelebratedSeed(lastCompletedSeed)

    const timeout = window.setTimeout(() => {
      setShowConfetti(false)
      if (statusMessage === 'puzzleComplete') {
        resetStatus(null)
      }
    }, 6000)

    return () => window.clearTimeout(timeout)
  }, [lastCompletedSeed, celebratedSeed, resetStatus, statusMessage])

  const incorrectSet = useMemo(() => {
    return new Set(incorrectCells.map((cell) => `${cell.row}-${cell.col}`))
  }, [incorrectCells])

  const containerClasses = clsx(
    'relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/90 p-4 shadow-panel backdrop-blur',
    highContrast && 'border-neutral-900 bg-white text-black',
  )

  const renderConfetti = showConfetti && confettiPieces.length > 0

  if (!puzzle) {
    return (
      <div className={containerClasses}>
        {renderConfetti ? (
          <CelebrationOverlay message={t('celebrationHeadline')} subtext={t('celebrationSubtext')} pieces={confettiPieces} />
        ) : null}
        <section className="flex flex-col items-center justify-center rounded-3xl bg-white/90 p-6 shadow-panel">
          <p className="text-lg text-neutral-600">{t('loadingBoard')}</p>
        </section>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={containerClasses}>
        {renderConfetti ? (
          <CelebrationOverlay message={t('puzzleComplete')} subtext={t('celebrationSubtext')} pieces={confettiPieces} />
        ) : null}
        <div className="grid grid-cols-9 gap-2">
          {gridIndices.map((row) =>
            gridIndices.map((col) => (
              <div key={`${row}-${col}`} className="aspect-square rounded-xl bg-neutral-200/60 animate-pulse" />
            )),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses}>
      {renderConfetti ? (
        <CelebrationOverlay message={t('celebrationHeadline')} subtext={t('celebrationSubtext')} pieces={confettiPieces} />
      ) : null}
      <div role="grid" aria-label={t('boardLabel')} className="grid grid-cols-9 gap-2" data-testid="sudoku-board">
        {gridIndices.map((row) =>
          gridIndices.map((col) => {
            const value = currentBoard[row][col]
            const isGiven = puzzle.givens[row][col]
            const isSelected = selectedCell?.row === row && selectedCell?.col === col
            const isRelated =
              !!selectedCell &&
              (selectedCell.row === row || selectedCell.col === col || isSameSubgrid(selectedCell, { row, col }))
            const isIncorrect = highlightErrors && incorrectSet.has(`${row}-${col}`)
            const noteValues = Array.from(notes[row][col]).sort((a, b) => a - b)

            const ariaParts: string[] = []
            ariaParts.push(isGiven ? t('cellGiven') : value === null ? t('cellEmpty') : t('cellValue', { value }))
            ariaParts.push(t('rowLabel', { row: row + 1 }))
            ariaParts.push(t('columnLabel', { col: col + 1 }))

            const borderClasses = clsx('border-2 border-neutral-200 transition-colors duration-150', {
              'border-l-4 border-neutral-300': col % 3 === 0,
              'border-t-4 border-neutral-300': row % 3 === 0,
              'border-r-4 border-neutral-300': (col + 1) % 3 === 0,
              'border-b-4 border-neutral-300': (row + 1) % 3 === 0,
            })

            return (
              <button
                type="button"
                role="gridcell"
                key={`${row}-${col}`}
                aria-selected={isSelected}
                aria-label={ariaParts.join(' ')}
                onClick={() => selectCell({ row, col })}
                onFocus={() => selectCell({ row, col })}
                disabled={isGiven}
                tabIndex={isSelected ? 0 : -1}
                className={clsx(
                  'relative flex aspect-square items-center justify-center rounded-2xl text-3xl font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                  'bg-white text-neutral-900',
                  borderClasses,
                  {
                    'border-brand-500 bg-brand-50 text-brand-900 shadow-lg': isSelected,
                    'border-danger bg-danger/20 text-danger transition-colors duration-150 shadow-md': isIncorrect,
                    'ring-2 ring-danger/60 ring-offset-2 ring-offset-white': isIncorrect,
                    'bg-brand-200/60 text-brand-900 outline outline-2 outline-brand-400/70':
                      isRelated && !isIncorrect && !isSelected,
                    'border-white bg-danger text-white': highContrast && isIncorrect,
                    'bg-neutral-900 text-white': highContrast && isSelected,
                    'bg-neutral-200 text-neutral-800 outline outline-2 outline-neutral-500/80':
                      highContrast && isRelated && !isSelected,
                    'cursor-default opacity-90': isGiven,
                  },
                )}
              >
                {value !== null ? (
                  <span className="text-shadow-soft">{value}</span>
                ) : noteValues.length > 0 ? (
                  <span className="grid w-full grid-cols-3 gap-x-1 gap-y-0.5 text-xs font-medium leading-4 text-neutral-500">
                    {noteValues.map((note) => (
                      <span key={note} className="text-center">
                        {note}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="sr-only">{t('cellEmpty')}</span>
                )}
              </button>
            )
          }),
        )}
      </div>
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white/80 p-3 text-sm text-neutral-600">
        <p>{t('boardInstructions')}</p>
      </div>
    </div>
  )
}

const isSameSubgrid = (a: Coordinate, b: Coordinate): boolean => {
  return Math.floor(a.row / 3) === Math.floor(b.row / 3) && Math.floor(a.col / 3) === Math.floor(b.col / 3)
}

interface ConfettiPiece {
  left: number
  delay: number
  duration: number
  drift: number
  startRotation: number
  endRotation: number
  color: string
}

const generateConfettiPieces = (): ConfettiPiece[] => {
  const colors = ['#4f5dff', '#f97316', '#4ad4c6', '#facc15', '#ec4899', '#9b87f5']
  return Array.from({ length: 160 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 3.5 + Math.random() * 2.5,
    drift: (Math.random() - 0.5) * 40,
    startRotation: Math.random() * 360,
    endRotation: 360 + Math.random() * 720,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))
}

interface CelebrationOverlayProps {
  message: string
  subtext: string
  pieces: ConfettiPiece[]
}

function CelebrationOverlay({ message, subtext, pieces }: CelebrationOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10" />
      <div className="absolute inset-0">
        {pieces.map((piece, index) => {
          const style: CSSProperties & Record<string, string> = {
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color,
            '--drift': `${piece.drift}vw`,
            '--start-rotation': `${piece.startRotation}deg`,
            '--end-rotation': `${piece.endRotation}deg`,
          }
          return (
            <span
              key={index}
              className="confetti-piece"
              style={style}
            />
          )
        })}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-full bg-white/85 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-brand-700 shadow-lg">
          {message}
        </div>
        <p className="max-w-md rounded-2xl bg-white/80 px-5 py-3 text-base font-medium text-neutral-700 shadow-md">
          {subtext}
        </p>
      </div>
    </div>
  )
}
