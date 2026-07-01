import type { Board } from "../types/sudoku";
import type { Position } from "./validation";

/** Finds the first empty, editable cell in row-major order — simple and predictable. */
export function findHintCell(board: Board): Position | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!cell.locked && cell.value === null) {
        return { row, col };
      }
    }
  }
  return null;
}
