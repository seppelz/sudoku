import type { Board } from './types';
export declare function solveBoard(board: Board): Board | null;
export declare function countSolutions(board: Board, limit?: number): number;
export declare function generateSolution(seed: string): Board;
