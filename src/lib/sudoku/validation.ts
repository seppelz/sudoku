import type { Board, CellValue, Coordinate } from './types'
import { BOARD_SIZE, collectColumn, collectRow, collectSubgrid, isValidPlacement } from './utils'

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === null) {
        return false
      }
    }
  }
  return true
}

export function isBoardValid(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col]
      if (value === null) {
        continue
      }
      board[row][col] = null
      const valid = isValidPlacement(board, row, col, value)
      board[row][col] = value
      if (!valid) {
        return false
      }
    }
  }
  return true
}

export function collectConflicts(board: Board, row: number, col: number, value: number): Coordinate[] {
  const conflicts: Coordinate[] = []

  for (let i = 0; i < BOARD_SIZE; i += 1) {
    if (i !== col && board[row][i] === value) {
      conflicts.push({ row, col: i })
    }
    if (i !== row && board[i][col] === value) {
      conflicts.push({ row: i, col })
    }
  }

  const subgridCells = collectSubgrid(board, row, col)
  const subgridStartRow = Math.floor(row / 3) * 3
  const subgridStartCol = Math.floor(col / 3) * 3

  subgridCells.forEach((cell, index) => {
    if (cell !== value) {
      return
    }
    const r = subgridStartRow + Math.floor(index / 3)
    const c = subgridStartCol + (index % 3)
    if (r !== row || c !== col) {
      conflicts.push({ row: r, col: c })
    }
  })

  return conflicts
}

export function getAvailableValues(board: Board, row: number, col: number): number[] {
  if (board[row][col] !== null) {
    return []
  }
  const existing = new Set<number>()
  collectRow(board, row).forEach((value) => {
    if (value !== null) {
      existing.add(value)
    }
  })
  collectColumn(board, col).forEach((value) => {
    if (value !== null) {
      existing.add(value)
    }
  })
  collectSubgrid(board, row, col).forEach((value) => {
    if (value !== null) {
      existing.add(value)
    }
  })

  const available: number[] = []
  for (let value = 1; value <= BOARD_SIZE; value += 1) {
    if (!existing.has(value)) {
      available.push(value)
    }
  }
  return available
}

export function findIncorrectCells(board: Board, solution: Board): Coordinate[] {
  const incorrect: Coordinate[] = []
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col]
      if (value !== null && value !== solution[row][col]) {
        incorrect.push({ row, col })
      }
    }
  }
  return incorrect
}

export function formatCoordinate({ row, col }: Coordinate): string {
  return `${row + 1}-${col + 1}`
}

export function serializeBoard(board: Board): string {
  return board
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null) {
            return '.'
          }
          return cell.toString()
        })
        .join(''),
    )
    .join('')
}

export function parseBoard(serialized: string): Board {
  if (serialized.length !== BOARD_SIZE * BOARD_SIZE) {
    throw new Error('Invalid serialized board length')
  }
  const board: Board = []
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const start = row * BOARD_SIZE
    const rowValues: CellValue[] = []
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const char = serialized[start + col]
      rowValues.push(char === '.' ? null : Number.parseInt(char, 10))
    }
    board.push(rowValues)
  }
  return board
}
