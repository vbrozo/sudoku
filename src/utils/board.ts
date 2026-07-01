import type { Board, Puzzle } from "../types/sudoku";

export function createBoardFromPuzzle(puzzle: Puzzle): Board {
  return puzzle.values.map((row) =>
    row.map((value) => ({
      value,
      locked: value !== null,
    })),
  );
}

export function boxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

export function isPeer(
  row: number,
  col: number,
  otherRow: number,
  otherCol: number,
): boolean {
  return (
    row === otherRow ||
    col === otherCol ||
    boxIndex(row, col) === boxIndex(otherRow, otherCol)
  );
}
