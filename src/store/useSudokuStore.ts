import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SudokuPuzzle, Board, Coordinate, Difficulty, NotesGrid, Hint } from '../lib/sudoku/types'
import { createEmptyBoard, cloneBoard } from '../lib/sudoku/utils'
import { findIncorrectCells, isBoardComplete, isBoardValid } from '../lib/sudoku/validation'
import { generateDailyPuzzle, generatePuzzle } from '../lib/sudoku/generator'
import seedrandom from 'seedrandom'
import { startOfDay } from 'date-fns'

type PlayMode = 'daily' | 'random'

export interface SudokuState {
  puzzle: SudokuPuzzle | null
  currentBoard: Board
  notes: NotesGrid
  selectedCell: Coordinate | null
  highlightErrors: boolean
  noteMode: boolean
  highContrast: boolean
  fontScale: number
  lastCompletedSeed: string | null
  statusMessage: string | null
  incorrectCells: Coordinate[]
  loading: boolean
  mode: PlayMode
  difficulty: Difficulty
  completedPuzzles: string[]
  completionHistory: CompletionRecord[]
  hasUserInput: boolean

  newRandomPuzzle: (difficulty?: Difficulty) => void
  loadDailyPuzzle: (difficulty?: Difficulty) => void
  setCellValue: (coordinate: Coordinate, value: number | null) => void
  toggleNote: (coordinate: Coordinate, value: number) => void
  clearNotes: (coordinate: Coordinate) => void
  selectCell: (coordinate: Coordinate | null) => void
  toggleHighlightErrors: () => void
  toggleNoteMode: () => void
  toggleHighContrast: () => void
  setFontScale: (scale: number) => void
  requestHint: () => Hint | null
  resetBoard: () => void
  setStatusMessage: (message: string | null) => void
  setMode: (mode: PlayMode) => void
  setDifficulty: (difficulty: Difficulty) => void
}

interface CompletionRecord {
  seed: string
  difficulty: Difficulty
  completedAt: string
}

const initialNotes = (): NotesGrid =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()))

const createSeedRandom = (seed?: string) => {
  if (seed) {
    return seedrandom(seed)
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint32Array(2)
    crypto.getRandomValues(buffer)
    return seedrandom(`${buffer[0]}-${buffer[1]}`)
  }
  return seedrandom()
}

const STORAGE_KEY = 'sudoku-progress'

export const useSudokuStore = create<SudokuState>()(
  persist(
    (set, get) => ({
  puzzle: null,
  currentBoard: createEmptyBoard(),
  notes: initialNotes(),
  selectedCell: null,
  highlightErrors: true,
  noteMode: false,
  highContrast: false,
  fontScale: 1,
  lastCompletedSeed: null,
  statusMessage: null,
  incorrectCells: [],
  loading: false,
  mode: 'daily',
  difficulty: 'leicht',
  completedPuzzles: [],
  completionHistory: [],
  hasUserInput: false,

  newRandomPuzzle: (difficulty) => {
    const nextDifficulty = difficulty ?? get().difficulty
    set({ loading: true, mode: 'random', difficulty: nextDifficulty })
    setTimeout(() => {
      const rng = createSeedRandom()
      const seed = rng().toString()
      const puzzle = generatePuzzle(seed, nextDifficulty)
      set({
        puzzle,
        currentBoard: cloneBoard(puzzle.puzzle),
        notes: initialNotes(),
        incorrectCells: [],
        selectedCell: { row: 0, col: 0 },
        loading: false,
        statusMessage: null,
        hasUserInput: false,
      })
    }, 0)
  },

  loadDailyPuzzle: (difficulty) => {
    const nextDifficulty = difficulty ?? get().difficulty
    set({ loading: true, mode: 'daily', difficulty: nextDifficulty })
    setTimeout(() => {
      const today = startOfDay(new Date())
      const puzzle = generateDailyPuzzle(today, nextDifficulty)
      set({
        puzzle,
        currentBoard: cloneBoard(puzzle.puzzle),
        notes: initialNotes(),
        incorrectCells: [],
        selectedCell: { row: 0, col: 0 },
        loading: false,
        statusMessage: null,
      })
    }, 0)
  },

  setCellValue: ({ row, col }, value) => {
    const { puzzle, noteMode, notes, currentBoard, highlightErrors } = get()
    if (!puzzle || puzzle.givens[row][col]) {
      return
    }

    if (noteMode && value !== null) {
      const nextNotes = notes.map((noteRow) => noteRow.map((cellNotes) => new Set(cellNotes)))
      const cellNotes = nextNotes[row][col]
      if (cellNotes.has(value)) {
        cellNotes.delete(value)
      } else {
        cellNotes.add(value)
      }
      const hasInput = nextNotes.some((rowNotes) => rowNotes.some((cellNotes) => cellNotes.size > 0))
      set({ notes: nextNotes, statusMessage: null, hasUserInput: hasInput })
      return
    }

    const nextBoard = cloneBoard(currentBoard)
    nextBoard[row][col] = value

    const nextNotes = notes.map((noteRow, rowIndex) =>
      noteRow.map((cellNotes, colIndex) => {
        if (rowIndex === row || colIndex === col) {
          const filtered = new Set(cellNotes)
          if (value !== null) {
            filtered.delete(value)
          }
          return filtered
        }
        return new Set(cellNotes)
      }),
    )

    if (value !== null) {
      nextNotes[row][col].clear()
    }

    let incorrectCells: Coordinate[] = []
    if (highlightErrors) {
      incorrectCells = findIncorrectCells(nextBoard, puzzle.solution)
    }

    const hasInput = nextBoard.some((rowValues, rowIndex) =>
      rowValues.some((cellValue, colIndex) => puzzle.puzzle[rowIndex][colIndex] !== cellValue),
    )

    set({
      currentBoard: nextBoard,
      notes: nextNotes,
      incorrectCells,
      statusMessage: null,
      hasUserInput: hasInput,
    })

    if (isBoardComplete(nextBoard)) {
      if (isBoardValid(nextBoard) && get().puzzle?.solution) {
        const puzzleSeed = get().puzzle?.seed ?? null
        const completedAt = new Date().toISOString()
        const difficultyLevel = get().puzzle?.difficulty ?? get().difficulty
        set((state) => {
          const alreadyTracked = puzzleSeed ? state.completedPuzzles.includes(puzzleSeed) : false
          const nextCompletedPuzzles = puzzleSeed
            ? alreadyTracked
              ? state.completedPuzzles
              : [...state.completedPuzzles, puzzleSeed]
            : state.completedPuzzles

          const historySeed = puzzleSeed ?? `random-${completedAt}`
          const entry: CompletionRecord = {
            seed: historySeed,
            difficulty: difficultyLevel,
            completedAt,
          }

          const filteredHistory = state.completionHistory.filter((record) => record.seed !== historySeed)
          const nextCompletionHistory = [entry, ...filteredHistory]
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, 20)

          return {
            lastCompletedSeed: puzzleSeed,
            statusMessage: 'puzzleComplete',
            completedPuzzles: nextCompletedPuzzles,
            completionHistory: nextCompletionHistory,
          }
        })
      } else {
        set({ statusMessage: 'hintUnavailable' })
      }
    }
  },

  toggleNote: ({ row, col }, value) => {
    const { notes, puzzle } = get()
    if (!puzzle || puzzle.givens[row][col]) {
      return
    }
    const nextNotes = notes.map((noteRow) => noteRow.map((cellNotes) => new Set(cellNotes)))
    const cellNotes = nextNotes[row][col]
    if (cellNotes.has(value)) {
      cellNotes.delete(value)
    } else {
      cellNotes.add(value)
    }
    const hasInput = nextNotes.some((rowNotes) => rowNotes.some((cellNotes) => cellNotes.size > 0))
    set({ notes: nextNotes, statusMessage: null, hasUserInput: hasInput })
  },

  clearNotes: ({ row, col }) => {
    const { notes } = get()
    const nextNotes = notes.map((noteRow) => noteRow.map((cellNotes) => new Set(cellNotes)))
    nextNotes[row][col].clear()
    const hasInput = nextNotes.some((rowNotes) => rowNotes.some((cellNotes) => cellNotes.size > 0))
    set({ notes: nextNotes, hasUserInput: hasInput })
  },

  selectCell: (coordinate) => {
    set({ selectedCell: coordinate })
  },

  toggleHighlightErrors: () => {
    const { highlightErrors, puzzle, currentBoard } = get()
    const enabled = !highlightErrors
    set({
      highlightErrors: enabled,
      incorrectCells: enabled && puzzle ? findIncorrectCells(currentBoard, puzzle.solution) : [],
    })
  },

  toggleNoteMode: () => {
    const { noteMode } = get()
    set({ noteMode: !noteMode })
  },

  toggleHighContrast: () => {
    const { highContrast } = get()
    set({ highContrast: !highContrast })
  },

  setFontScale: (scale) => {
    set({ fontScale: scale })
  },

  requestHint: () => {
    const { puzzle, currentBoard } = get()
    if (!puzzle) {
      return null
    }
    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        if (currentBoard[row][col] === null) {
          const solutionValue = puzzle.solution[row][col]
          if (solutionValue === null) {
            continue
          }
          const value = solutionValue
          get().setCellValue({ row, col }, value)
          set({ statusMessage: 'nextHintAnnouncement' })
          return { coordinate: { row, col }, value }
        }
      }
    }
    set({ statusMessage: 'hintUnavailable' })
    return null
  },

  resetBoard: () => {
    const { puzzle } = get()
    if (!puzzle) {
      return
    }
    set({
      currentBoard: cloneBoard(puzzle.puzzle),
      notes: initialNotes(),
      incorrectCells: [],
      statusMessage: null,
      hasUserInput: false,
    })
  },

  setStatusMessage: (message) => set({ statusMessage: message }),

  setMode: (mode) => {
    if (mode === 'daily') {
      get().loadDailyPuzzle()
    } else {
      get().newRandomPuzzle()
    }
  },

  setDifficulty: (difficulty) => {
    if (get().mode === 'daily') {
      get().loadDailyPuzzle(difficulty)
    } else {
      get().newRandomPuzzle(difficulty)
    }
  },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({
          completedPuzzles: state.completedPuzzles,
          completionHistory: state.completionHistory,
        }) satisfies Pick<SudokuState, 'completedPuzzles' | 'completionHistory'>,
    },
  ),
)
