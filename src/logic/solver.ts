import type { Digit, Grid } from "../types/sudoku";
import { BOARD_SIZE } from "./rules";
import { isGridValid, isMoveLegal } from "./validation";

export type SolveResult =
  | { success: true; grid: Grid }
  | { success: false };

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.slice());
}

function findEmptyCell(grid: Grid): { row: number; col: number } | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (grid[row][col] === null) return { row, col };
    }
  }
  return null;
}

function backtrack(grid: Grid): boolean {
  const empty = findEmptyCell(grid);
  if (!empty) return true;

  const { row, col } = empty;
  for (let value = 1; value <= 9; value++) {
    const candidate = value as Digit;
    if (!isMoveLegal(grid, row, col, candidate)) continue;

    grid[row][col] = candidate;
    if (backtrack(grid)) return true;
    grid[row][col] = null;
  }

  return false;
}

/**
 * Solves a Sudoku grid using backtracking with constraint checks.
 * Returns null if the starting grid is invalid or has no solution.
 */
export function solveGrid(grid: Grid): Grid | null {
  if (!isGridValid(grid)) return null;

  const working = cloneGrid(grid);
  const solved = backtrack(working);
  return solved ? working : null;
}

/** Same as solveGrid, wrapped in a discriminated result for callers that want an explicit outcome. */
export function solveSudoku(grid: Grid): SolveResult {
  const solved = solveGrid(grid);
  return solved ? { success: true, grid: solved } : { success: false };
}
