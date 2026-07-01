import { describe, expect, it } from "vitest";
import type { Board, Grid } from "../types/sudoku";
import { findMistakes, isBoardSolved } from "./mistakes";

const N = null;

const solution: Grid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function boardFromValues(values: Grid, lockedMask: boolean[][]): Board {
  return values.map((row, r) =>
    row.map((value, c) => ({ value, locked: lockedMask[r][c], notes: [] })),
  );
}

const allUnlocked = Array.from({ length: 9 }, () => Array(9).fill(false));

describe("findMistakes", () => {
  it("returns nothing for an empty board", () => {
    const empty: Grid = Array.from({ length: 9 }, () => Array<null>(9).fill(N));
    const board = boardFromValues(empty, allUnlocked);
    expect(findMistakes(board, solution)).toEqual([]);
  });

  it("returns nothing when every filled cell matches the solution", () => {
    const board = boardFromValues(solution, allUnlocked);
    expect(findMistakes(board, solution)).toEqual([]);
  });

  it("flags editable cells that don't match the solution", () => {
    const values = solution.map((row) => row.slice());
    values[0][0] = 3; // should be 5
    const board = boardFromValues(values, allUnlocked);
    expect(findMistakes(board, solution)).toEqual([{ row: 0, col: 0 }]);
  });

  it("never flags a locked cell, even if it disagrees with the solution", () => {
    const values = solution.map((row) => row.slice());
    values[0][0] = 3;
    const lockedMask = allUnlocked.map((row) => row.slice());
    lockedMask[0][0] = true;
    const board = boardFromValues(values, lockedMask);
    expect(findMistakes(board, solution)).toEqual([]);
  });
});

describe("isBoardSolved", () => {
  it("is true when the board exactly matches the solution", () => {
    const board = boardFromValues(solution, allUnlocked);
    expect(isBoardSolved(board, solution)).toBe(true);
  });

  it("is false when a cell is still empty", () => {
    const values = solution.map((row) => row.slice());
    values[4][4] = null;
    const board = boardFromValues(values, allUnlocked);
    expect(isBoardSolved(board, solution)).toBe(false);
  });

  it("is false when a cell has an incorrect value", () => {
    const values = solution.map((row) => row.slice());
    values[0][0] = 3;
    const board = boardFromValues(values, allUnlocked);
    expect(isBoardSolved(board, solution)).toBe(false);
  });
});
