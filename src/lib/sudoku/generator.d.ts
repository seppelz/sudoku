import type { Board, Difficulty, SudokuPuzzle } from './types';
export declare function generatePuzzle(seed: string, difficulty: Difficulty): SudokuPuzzle;
export declare function generateDailyPuzzle(date: Date, difficulty: Difficulty): SudokuPuzzle;
export declare function maskBoard(board: Board): boolean[][];
export declare function mergeBoard(base: Board, overlay: Board): Board;
