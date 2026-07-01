import type { Board, Grid } from "../types/sudoku";
import type { Position } from "./validation";

/** Editable cells whose value doesn't match the solution. Locked and empty cells are never mistakes. */
export function findMistakes(board: Board, solution: Grid): Position[] {
  const mistakes: Position[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell.locked || cell.value === null) continue;
      if (cell.value !== solution[row][col]) {
        mistakes.push({ row, col });
      }
    }
  }

  return mistakes;
}

/** True when every cell is filled and matches the solution exactly. */
export function isBoardSolved(board: Board, solution: Grid): boolean {
  return board.every((row, rowIndex) =>
    row.every((cell, colIndex) => cell.value === solution[rowIndex][colIndex]),
  );
}
