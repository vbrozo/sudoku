import type { Board, Cell, Puzzle } from "../types/sudoku";

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

/** Returns a new board with the given cell shallow-merged with `patch`, leaving the rest untouched. */
export function updateCell(
  board: Board,
  row: number,
  col: number,
  patch: Partial<Cell>,
): Board {
  const next = board.map((r) => r.slice());
  next[row] = next[row].slice();
  next[row][col] = { ...next[row][col], ...patch };
  return next;
}
