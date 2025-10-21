import type { Board } from './types'
import { BOARD_SIZE, cloneBoard, findEmptyCell, isValidPlacement, shuffle } from './utils'
import seedrandom from 'seedrandom'

export function solveBoard(board: Board): Board | null {
  const working = cloneBoard(board)
  if (solveInternal(working)) {
    return working
  }
  return null
}

function solveInternal(board: Board): boolean {
  const empty = findEmptyCell(board)
  if (!empty) {
    return true
  }
  const { row, col } = empty
  for (let value = 1; value <= BOARD_SIZE; value += 1) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value
      if (solveInternal(board)) {
        return true
      }
      board[row][col] = null
    }
  }
  return false
}

export function countSolutions(board: Board, limit = 2): number {
  const empty = findEmptyCell(board)
  if (!empty) {
    return 1
  }
  let total = 0
  const { row, col } = empty
  for (let value = 1; value <= BOARD_SIZE; value += 1) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value
      total += countSolutions(board, limit)
      if (total >= limit) {
        board[row][col] = null
        break
      }
      board[row][col] = null
    }
  }
  return total
}

export function generateSolution(seed: string): Board {
  const rng = seedrandom(seed)
  const board = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null))
  fill(board, rng)
  return board
}

function fill(board: Board, rng: seedrandom.PRNG): boolean {
  const empty = findEmptyCell(board)
  if (!empty) {
    return true
  }
  const { row, col } = empty
  const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)
  for (const value of values) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value
      if (fill(board, rng)) {
        return true
      }
      board[row][col] = null
    }
  }
  return false
}
