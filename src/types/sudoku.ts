export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellValue = Digit | null;

export interface Cell {
  value: CellValue;
  locked: boolean;
}

export type Board = Cell[][];

export interface Puzzle {
  values: CellValue[][];
}

export interface GameState {
  board: Board;
  selected: { row: number; col: number } | null;
}
