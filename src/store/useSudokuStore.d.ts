import type { SudokuPuzzle, Board, Coordinate, Difficulty, NotesGrid, Hint } from '../lib/sudoku/types';
type PlayMode = 'daily' | 'random';
export interface SudokuState {
    puzzle: SudokuPuzzle | null;
    currentBoard: Board;
    notes: NotesGrid;
    selectedCell: Coordinate | null;
    highlightErrors: boolean;
    noteMode: boolean;
    highContrast: boolean;
    fontScale: number;
    lastCompletedSeed: string | null;
    statusMessage: string | null;
    incorrectCells: Coordinate[];
    loading: boolean;
    mode: PlayMode;
    difficulty: Difficulty;
    completedPuzzles: string[];
    completionHistory: CompletionRecord[];
    newRandomPuzzle: (difficulty?: Difficulty) => void;
    loadDailyPuzzle: (difficulty?: Difficulty) => void;
    setCellValue: (coordinate: Coordinate, value: number | null) => void;
    toggleNote: (coordinate: Coordinate, value: number) => void;
    clearNotes: (coordinate: Coordinate) => void;
    selectCell: (coordinate: Coordinate | null) => void;
    toggleHighlightErrors: () => void;
    toggleNoteMode: () => void;
    toggleHighContrast: () => void;
    setFontScale: (scale: number) => void;
    requestHint: () => Hint | null;
    resetBoard: () => void;
    setStatusMessage: (message: string | null) => void;
    setMode: (mode: PlayMode) => void;
    setDifficulty: (difficulty: Difficulty) => void;
}
interface CompletionRecord {
    seed: string;
    difficulty: Difficulty;
    completedAt: string;
}
export declare const useSudokuStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SudokuState>>;
export {};
