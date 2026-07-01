import { describe, expect, it } from "vitest";
import type { Board } from "../types/sudoku";
import { clearCellNotes, clearNoteFromPeers, toggleCellNote } from "./notes";

function emptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, locked: false, notes: [] })),
  );
}

describe("toggleCellNote", () => {
  it("adds a note when absent", () => {
    const board = toggleCellNote(emptyBoard(), 0, 0, 5);
    expect(board[0][0].notes).toEqual([5]);
  });

  it("removes a note when already present", () => {
    let board = toggleCellNote(emptyBoard(), 0, 0, 5);
    board = toggleCellNote(board, 0, 0, 5);
    expect(board[0][0].notes).toEqual([]);
  });

  it("keeps notes sorted", () => {
    let board = toggleCellNote(emptyBoard(), 0, 0, 5);
    board = toggleCellNote(board, 0, 0, 2);
    board = toggleCellNote(board, 0, 0, 8);
    expect(board[0][0].notes).toEqual([2, 5, 8]);
  });

  it("does not mutate other cells", () => {
    const original = emptyBoard();
    const board = toggleCellNote(original, 0, 0, 5);
    expect(board[1][1]).toBe(original[1][1]);
    expect(original[0][0].notes).toEqual([]);
  });
});

describe("clearCellNotes", () => {
  it("clears all notes from a cell", () => {
    let board = toggleCellNote(emptyBoard(), 3, 3, 1);
    board = toggleCellNote(board, 3, 3, 7);
    board = clearCellNotes(board, 3, 3);
    expect(board[3][3].notes).toEqual([]);
  });

  it("returns the same board reference when there is nothing to clear", () => {
    const board = emptyBoard();
    expect(clearCellNotes(board, 0, 0)).toBe(board);
  });
});

describe("clearNoteFromPeers", () => {
  it("removes the value from row, column, and box peers only", () => {
    let board = emptyBoard();
    board = toggleCellNote(board, 0, 5, 4); // same row
    board = toggleCellNote(board, 5, 0, 4); // same column
    board = toggleCellNote(board, 1, 1, 4); // same box
    board = toggleCellNote(board, 5, 5, 4); // unrelated cell

    board = clearNoteFromPeers(board, 0, 0, 4);

    expect(board[0][5].notes).toEqual([]);
    expect(board[5][0].notes).toEqual([]);
    expect(board[1][1].notes).toEqual([]);
    expect(board[5][5].notes).toEqual([4]);
  });

  it("leaves other candidate values untouched", () => {
    let board = toggleCellNote(emptyBoard(), 0, 5, 4);
    board = toggleCellNote(board, 0, 5, 7);

    board = clearNoteFromPeers(board, 0, 0, 4);

    expect(board[0][5].notes).toEqual([7]);
  });
});
