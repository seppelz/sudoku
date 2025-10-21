import seedrandom from 'seedrandom'
import type { Board, CellValue, Coordinate } from './types'

export const BOARD_SIZE = 9
export const SUBGRID_SIZE = 3

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

export function isValidPlacement(board: Board, row: number, col: number, value: number): boolean {
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    if (board[row][i] === value || board[i][col] === value) {
      return false
    }
  }

  const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE
  const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE

  for (let r = 0; r < SUBGRID_SIZE; r += 1) {
    for (let c = 0; c < SUBGRID_SIZE; c += 1) {
      if (board[startRow + r][startCol + c] === value) {
        return false
      }
    }
  }

  return true
}

export function findEmptyCell(board: Board): Coordinate | null {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === null) {
        return { row, col }
      }
    }
  }
  return null
}

export function shuffle<T>(items: T[], rng: seedrandom.PRNG): T[] {
  const array = [...items]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function generateSeedFromDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function compareBoards(a: Board, b: Board): boolean {
  return a.every((row, rowIndex) => row.every((cell, colIndex) => cell === b[rowIndex][colIndex]))
}

export function collectRow(board: Board, row: number): CellValue[] {
  return [...board[row]]
}

export function collectColumn(board: Board, column: number): CellValue[] {
  return board.map((row) => row[column])
}

export function collectSubgrid(board: Board, row: number, column: number): CellValue[] {
  const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE
  const startCol = Math.floor(column / SUBGRID_SIZE) * SUBGRID_SIZE
  const values: CellValue[] = []

  for (let r = 0; r < SUBGRID_SIZE; r += 1) {
    for (let c = 0; c < SUBGRID_SIZE; c += 1) {
      values.push(board[startRow + r][startCol + c])
    }
  }

  return values
}
