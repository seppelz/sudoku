export type CellValue = number | null

export type Board = CellValue[][]

export type Difficulty = 'leicht' | 'mittel' | 'schwer' | 'meister'

export interface Coordinate {
  row: number
  col: number
}

export interface SudokuPuzzle {
  puzzle: Board
  solution: Board
  givens: boolean[][]
  difficulty: Difficulty
  seed: string
}

export type NoteSet = Set<number>
export type NotesGrid = NoteSet[][]

export interface Hint {
  coordinate: Coordinate
  value: number
}
