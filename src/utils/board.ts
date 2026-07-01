import type { Board, Puzzle } from "../types/sudoku";

export function createBoardFromPuzzle(puzzle: Puzzle): Board {
  return puzzle.values.map((row) =>
    row.map((value) => ({
      value,
      locked: value !== null,
      notes: [],
      hinted: false,
    })),
  );
}
