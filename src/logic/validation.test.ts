import { describe, expect, it } from "vitest";
import type { Grid } from "../types/sudoku";
import {
  findConflicts,
  isGridComplete,
  isGridValid,
  isMoveLegal,
} from "./validation";

const N = null;

const validPuzzle: Grid = [
  [5, 3, N, N, 7, N, N, N, N],
  [6, N, N, 1, 9, 5, N, N, N],
  [N, 9, 8, N, N, N, N, 6, N],
  [8, N, N, N, 6, N, N, N, 3],
  [4, N, N, 8, N, 3, N, N, 1],
  [7, N, N, N, 2, N, N, N, 6],
  [N, 6, N, N, N, N, 2, 8, N],
  [N, N, N, 4, 1, 9, N, N, 5],
  [N, N, N, N, 8, N, N, 7, 9],
];

const solvedPuzzle: Grid = [
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

describe("isGridValid", () => {
  it("accepts a partially filled puzzle with no conflicts", () => {
    expect(isGridValid(validPuzzle)).toBe(true);
  });

  it("accepts a fully solved puzzle", () => {
    expect(isGridValid(solvedPuzzle)).toBe(true);
  });

  it("rejects a grid with a duplicate in a row", () => {
    const grid = validPuzzle.map((row) => row.slice());
    grid[0][2] = 5; // duplicates the 5 already in row 0
    expect(isGridValid(grid)).toBe(false);
  });

  it("rejects a grid with a duplicate in a column", () => {
    const grid = validPuzzle.map((row) => row.slice());
    grid[2][0] = 5; // duplicates the 5 in column 0, row 0
    expect(isGridValid(grid)).toBe(false);
  });

  it("rejects a grid with a duplicate in a box", () => {
    const grid = validPuzzle.map((row) => row.slice());
    grid[2][2] = 3; // duplicates the 3 in row 1, box 0
    expect(isGridValid(grid)).toBe(false);
  });
});

describe("findConflicts", () => {
  it("returns no conflicts for a valid grid", () => {
    expect(findConflicts(validPuzzle)).toEqual([]);
  });

  it("returns every cell involved in a duplicate", () => {
    const grid = validPuzzle.map((row) => row.slice());
    grid[0][2] = 5; // row 0 now has two 5s: (0,0) and (0,2)
    const conflicts = findConflicts(grid);
    expect(conflicts).toEqual(
      expect.arrayContaining([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ]),
    );
    expect(conflicts).toHaveLength(2);
  });
});

describe("isMoveLegal", () => {
  it("allows a value with no conflicting peers", () => {
    expect(isMoveLegal(validPuzzle, 0, 2, 4)).toBe(true);
  });

  it("rejects a value already used in the same row", () => {
    expect(isMoveLegal(validPuzzle, 0, 2, 3)).toBe(false);
  });

  it("rejects a value already used in the same column", () => {
    expect(isMoveLegal(validPuzzle, 8, 0, 5)).toBe(false);
  });

  it("rejects a value already used in the same box", () => {
    expect(isMoveLegal(validPuzzle, 2, 2, 3)).toBe(false);
  });

  it("allows clearing a cell", () => {
    expect(isMoveLegal(validPuzzle, 0, 0, null)).toBe(true);
  });
});

describe("isGridComplete", () => {
  it("is false for a partially filled grid", () => {
    expect(isGridComplete(validPuzzle)).toBe(false);
  });

  it("is true for a fully and correctly filled grid", () => {
    expect(isGridComplete(solvedPuzzle)).toBe(true);
  });

  it("is false for a fully filled grid that has a conflict", () => {
    const grid = solvedPuzzle.map((row) => row.slice());
    grid[0][0] = grid[0][1]; // introduce a duplicate in row 0
    expect(isGridComplete(grid)).toBe(false);
  });
});
