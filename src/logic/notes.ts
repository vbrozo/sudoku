import type { Board, Digit } from "../types/sudoku";
import { isPeer } from "./rules";

/** Adds or removes `value` from a cell's candidate notes. */
export function toggleCellNote(board: Board, row: number, col: number, value: Digit): Board {
  const cell = board[row][col];
  const notes = cell.notes.includes(value)
    ? cell.notes.filter((n) => n !== value)
    : [...cell.notes, value].sort((a, b) => a - b);

  const next = board.map((r) => r.slice());
  next[row] = next[row].slice();
  next[row][col] = { ...cell, notes };
  return next;
}

export function clearCellNotes(board: Board, row: number, col: number): Board {
  const cell = board[row][col];
  if (cell.notes.length === 0) return board;

  const next = board.map((r) => r.slice());
  next[row] = next[row].slice();
  next[row][col] = { ...cell, notes: [] };
  return next;
}

/** Removes `value` from the notes of every row/column/box peer of (row, col). */
export function clearNoteFromPeers(
  board: Board,
  row: number,
  col: number,
  value: Digit,
): Board {
  const next = board.map((r) => r.slice());

  for (let r = 0; r < next.length; r++) {
    for (let c = 0; c < next[r].length; c++) {
      if (!isPeer(row, col, r, c)) continue;
      const cell = next[r][c];
      if (!cell.notes.includes(value)) continue;
      next[r][c] = { ...cell, notes: cell.notes.filter((n) => n !== value) };
    }
  }

  return next;
}
