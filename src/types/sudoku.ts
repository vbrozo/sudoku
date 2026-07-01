export type CellValue = number | null;

export interface Cell {
  value: CellValue;
  locked: boolean;
}

export type Board = Cell[][];

export interface Puzzle {
  values: (number | null)[][];
}

export interface GameState {
  board: Board;
  selected: { row: number; col: number } | null;
}
