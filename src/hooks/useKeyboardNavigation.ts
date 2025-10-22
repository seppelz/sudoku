import { useEffect } from 'react'
import { useSudokuStore } from '../store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'

const codeToValue: Record<string, number> = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 3,
  Digit4: 4,
  Digit5: 5,
  Digit6: 6,
  Digit7: 7,
  Digit8: 8,
  Digit9: 9,
  Numpad1: 1,
  Numpad2: 2,
  Numpad3: 3,
  Numpad4: 4,
  Numpad5: 5,
  Numpad6: 6,
  Numpad7: 7,
  Numpad8: 8,
  Numpad9: 9,
}

const keyToValue: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  F1: 1,
  F2: 2,
  F3: 3,
  F4: 4,
  F5: 5,
  F6: 6,
  F7: 7,
  F8: 8,
  F9: 9,
}

export function useKeyboardNavigation(): void {
  const { puzzle, selectedCell, setCellValue, selectCell, toggleNote, noteMode, resetBoard } = useSudokuStore(
    useShallow((state) => ({
      puzzle: state.puzzle,
      selectedCell: state.selectedCell,
      setCellValue: state.setCellValue,
      selectCell: state.selectCell,
      toggleNote: state.toggleNote,
      noteMode: state.noteMode,
      resetBoard: state.resetBoard,
    })),
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (!puzzle) {
        return
      }
      const { row, col } = selectedCell ?? { row: 0, col: 0 }

      switch (event.key) {
        case 'ArrowUp': {
          event.preventDefault()
          selectCell({ row: row > 0 ? row - 1 : 8, col })
          break
        }
        case 'ArrowDown': {
          event.preventDefault()
          selectCell({ row: row < 8 ? row + 1 : 0, col })
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          selectCell({ row, col: col > 0 ? col - 1 : 8 })
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          selectCell({ row, col: col < 8 ? col + 1 : 0 })
          break
        }
        case 'Delete':
        case 'Backspace': {
          if (selectedCell) {
            event.preventDefault()
            setCellValue(selectedCell, null)
          }
          break
        }
        case 'n':
        case 'N': {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            resetBoard()
          }
          break
        }
        default: {
          const valueFromKey = keyToValue[event.key]
          const valueFromCode = codeToValue[event.code]
          const value = valueFromKey ?? valueFromCode
          if (value && selectedCell) {
            event.preventDefault()
            if (noteMode) {
              toggleNote(selectedCell, value)
            } else {
              setCellValue(selectedCell, value)
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [puzzle, selectedCell, selectCell, setCellValue, toggleNote, noteMode, resetBoard])
}
