import { describe, expect, it } from "vitest";
import type { Puzzle } from "../types/sudoku";
import { createBoardFromPuzzle, hasBoardProgress, updateCell } from "./board";

const N = null;

describe("createBoardFromPuzzle", () => {
  it("locks givens and leaves blanks editable with no notes or hints", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    const board = createBoardFromPuzzle(puzzle);

    expect(board[0][0]).toEqual({ value: 5, locked: true, notes: [], hinted: false });
    expect(board[0][1]).toEqual({ value: null, locked: false, notes: [], hinted: false });
  });
});

describe("hasBoardProgress", () => {
  it("is false for a freshly created board", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    expect(hasBoardProgress(createBoardFromPuzzle(puzzle))).toBe(false);
  });

  it("is true once an editable cell has a value", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    const board = createBoardFromPuzzle(puzzle);
    board[0][1] = { value: 3, locked: false, notes: [], hinted: false };
    expect(hasBoardProgress(board)).toBe(true);
  });

  it("ignores locked givens", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    expect(hasBoardProgress(createBoardFromPuzzle(puzzle))).toBe(false);
  });
});

describe("updateCell", () => {
  it("merges the patch into the target cell only", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    const board = createBoardFromPuzzle(puzzle);
    const updated = updateCell(board, 1, 2, { value: 7, hinted: true });

    expect(updated[1][2]).toEqual({ value: 7, locked: false, notes: [], hinted: true });
    expect(updated[0][0]).toEqual(board[0][0]);
  });

  it("does not mutate the input board", () => {
    const puzzle: Puzzle = {
      values: [
        [5, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
        [N, N, N, N, N, N, N, N, N],
      ],
    };
    const board = createBoardFromPuzzle(puzzle);
    updateCell(board, 3, 3, { value: 9 });
    expect(board[3][3].value).toBeNull();
  });
});
