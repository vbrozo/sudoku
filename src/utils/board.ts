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

/** True if the player has filled in at least one editable cell. */
export function hasBoardProgress(board: Board): boolean {
  return board.some((row) => row.some((cell) => !cell.locked && cell.value !== null));
}
