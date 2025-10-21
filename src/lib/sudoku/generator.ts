import seedrandom from 'seedrandom'
import type { Board, Difficulty, SudokuPuzzle } from './types'
import { BOARD_SIZE, cloneBoard, createEmptyBoard, generateSeedFromDate, shuffle } from './utils'
import { countSolutions, generateSolution } from './solver'

const difficultyConfig: Record<Difficulty, { minRemoved: number; maxRemoved: number }> = {
  leicht: { minRemoved: 36, maxRemoved: 42 },
  mittel: { minRemoved: 42, maxRemoved: 48 },
  schwer: { minRemoved: 48, maxRemoved: 54 },
  meister: { minRemoved: 54, maxRemoved: 58 },
}

export function generatePuzzle(seed: string, difficulty: Difficulty): SudokuPuzzle {
  const solution = generateSolution(seed)
  const puzzle = createPuzzleFromSolution(solution, seed, difficulty)
  return {
    puzzle,
    solution,
    givens: puzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => cell !== null && solution[rowIndex][colIndex] === cell),
    ),
    difficulty,
    seed,
  }
}

export function generateDailyPuzzle(date: Date, difficulty: Difficulty): SudokuPuzzle {
  const seed = `${generateSeedFromDate(date)}-${difficulty}`
  return generatePuzzle(seed, difficulty)
}

function createPuzzleFromSolution(solution: Board, seed: string, difficulty: Difficulty): Board {
  const { minRemoved, maxRemoved } = difficultyConfig[difficulty]
  const rng = seedrandom(seed)
  const totalToRemove = Math.floor(minRemoved + rng() * (maxRemoved - minRemoved + 1))
  const puzzle = cloneBoard(solution)

  const positions = shuffle(
    Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => ({
      row: Math.floor(index / BOARD_SIZE),
      col: index % BOARD_SIZE,
    })),
    rng,
  )

  let removed = 0
  for (const position of positions) {
    if (removed >= totalToRemove) {
      break
    }
    const { row, col } = position
    const backup = puzzle[row][col]
    if (backup === null) {
      continue
    }
    puzzle[row][col] = null
    const solutions = countSolutions(cloneBoard(puzzle), 2)
    if (solutions !== 1) {
      puzzle[row][col] = backup
      continue
    }
    removed += 1
  }

  return puzzle
}

export function maskBoard(board: Board): boolean[][] {
  return board.map((row) => row.map((cell) => cell !== null))
}

export function mergeBoard(base: Board, overlay: Board): Board {
  const merged = createEmptyBoard()
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      merged[row][col] = overlay[row][col] ?? base[row][col]
    }
  }
  return merged
}
