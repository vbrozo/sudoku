export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellValue = Digit | null;

export interface Cell {
  value: CellValue;
  locked: boolean;
  /** Pencil-marked candidate digits; only meaningful while value is null. */
  notes: Digit[];
  /** True if this cell's value was filled in by the hint system. */
  hinted: boolean;
}

export type Board = Cell[][];

/** Plain 9x9 grid of values, with no locked/UI state — used by the solver and validators. */
export type Grid = CellValue[][];

export interface Puzzle {
  values: CellValue[][];
}

export interface GameState {
  board: Board;
  selected: { row: number; col: number } | null;
}

export type Difficulty = "easy" | "medium" | "hard";
