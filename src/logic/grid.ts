import type { Board, Grid } from "../types/sudoku";

export function boardToGrid(board: Board): Grid {
  return board.map((row) => row.map((cell) => cell.value));
}
