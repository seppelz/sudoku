import clsx from 'clsx'
import { useSudokuStore, type SudokuState } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'

export function MobileNumberPad() {
  const {
    selectedCell,
    setCellValue,
    toggleNote,
    clearNotes,
    noteMode,
    toggleNoteMode,
    requestHint,
    loading,
  } = useSudokuStore(
    useShallow((state: SudokuState) => ({
      selectedCell: state.selectedCell,
      setCellValue: state.setCellValue,
      toggleNote: state.toggleNote,
      clearNotes: state.clearNotes,
      noteMode: state.noteMode,
      toggleNoteMode: state.toggleNoteMode,
      requestHint: state.requestHint,
      loading: state.loading,
    })),
  )

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
    <div className="bg-white px-4 py-3 shadow-lg">
      {/* Control buttons */}
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            noteMode
              ? 'bg-brand-600 text-white'
              : 'border-2 border-neutral-200 bg-white text-neutral-700'
          )}
          onClick={toggleNoteMode}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          <span>Notizen</span>
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          onClick={handleClear}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
          <span>Löschen</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-success px-3 py-2 text-sm font-semibold text-white transition hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
          onClick={requestHint}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </button>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-9 gap-1.5">
        {Array.from({ length: 9 }, (_, index) => index + 1).map((value) => (
          <button
            key={value}
            type="button"
            className="aspect-square rounded-lg border-2 border-neutral-200 bg-white text-xl font-bold text-neutral-800 transition active:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            onClick={() => handleNumberInput(value)}
            disabled={loading}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}
