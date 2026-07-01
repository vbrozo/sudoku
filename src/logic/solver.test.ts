import { describe, expect, it } from "vitest";
import type { Grid } from "../types/sudoku";
import { isGridComplete } from "./validation";
import { solveGrid, solveSudoku } from "./solver";

const N = null;

const solvablePuzzle: Grid = [
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

const expectedSolution: Grid = [
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

// Two givens in the same row conflict with each other, so no solution exists.
const unsolvablePuzzle: Grid = expectedSolution.map((row) => row.slice());
unsolvablePuzzle[0] = [5, 5, N, N, N, N, N, N, N];

describe("solveGrid", () => {
  it("solves a known puzzle", () => {
    expect(solveGrid(solvablePuzzle)).toEqual(expectedSolution);
  });

  it("returns a grid that is complete and conflict-free", () => {
    const solved = solveGrid(solvablePuzzle);
    expect(solved).not.toBeNull();
    expect(isGridComplete(solved!)).toBe(true);
  });

  it("returns null for a puzzle with conflicting givens", () => {
    expect(solveGrid(unsolvablePuzzle)).toBeNull();
  });

  it("returns the same grid, unchanged, for an already-solved puzzle", () => {
    expect(solveGrid(expectedSolution)).toEqual(expectedSolution);
  });

  it("does not mutate the input grid", () => {
    const input = solvablePuzzle.map((row) => row.slice());
    solveGrid(input);
    expect(input).toEqual(solvablePuzzle);
  });
});

describe("solveSudoku", () => {
  it("reports success with the solved grid", () => {
    const result = solveSudoku(solvablePuzzle);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.grid).toEqual(expectedSolution);
    }
  });

  it("reports failure for an unsolvable puzzle", () => {
    const result = solveSudoku(unsolvablePuzzle);
    expect(result.success).toBe(false);
  });
});
