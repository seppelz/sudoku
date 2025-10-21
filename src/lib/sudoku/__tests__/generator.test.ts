import { describe, it, expect } from 'vitest'
import { generatePuzzle, generateDailyPuzzle } from '../generator'

describe('Sudoku puzzle generation', () => {
  it('creates puzzles with unique solutions', () => {
    const puzzle = generatePuzzle('test-seed', 'mittel')
    expect(puzzle.puzzle.length).toBe(9)
    expect(puzzle.givens.flat().filter(Boolean).length).toBeGreaterThan(20)
    expect(puzzle.solution.flat().every((value) => value !== null)).toBe(true)
  })

  it('generates deterministic daily puzzles', () => {
    const date = new Date('2025-10-21')
    const first = generateDailyPuzzle(date, 'leicht')
    const second = generateDailyPuzzle(date, 'leicht')
    expect(first.seed).toBe(second.seed)
    expect(first.puzzle).toEqual(second.puzzle)
  })
})
