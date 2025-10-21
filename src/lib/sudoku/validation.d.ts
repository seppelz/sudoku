import type { Board, Coordinate } from './types';
export declare function isBoardComplete(board: Board): boolean;
export declare function isBoardValid(board: Board): boolean;
export declare function collectConflicts(board: Board, row: number, col: number, value: number): Coordinate[];
export declare function getAvailableValues(board: Board, row: number, col: number): number[];
export declare function findIncorrectCells(board: Board, solution: Board): Coordinate[];
export declare function formatCoordinate({ row, col }: Coordinate): string;
export declare function serializeBoard(board: Board): string;
export declare function parseBoard(serialized: string): Board;
