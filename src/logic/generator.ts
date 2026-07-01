import type { Difficulty, Digit, Grid, Puzzle } from "../types/sudoku";
import { cloneGrid, findEmptyCell } from "./solver";
import { isMoveLegal } from "./validation";

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Number of cells cleared out of the 81, per difficulty. More removed
// cells means fewer givens and a harder puzzle.
const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy: 36,
  medium: 46,
  hard: 54,
};

function shuffled<T>(items: T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function fillGrid(grid: Grid): boolean {
  const empty = findEmptyCell(grid);
  if (!empty) return true;

  const { row, col } = empty;
  for (const candidate of shuffled(DIGITS)) {
    if (!isMoveLegal(grid, row, col, candidate)) continue;

    grid[row][col] = candidate;
    if (fillGrid(grid)) return true;
    grid[row][col] = null;
  }

  return false;
}

/** Builds a complete, randomly generated, valid Sudoku solution. */
export function generateSolvedGrid(): Grid {
  const grid: Grid = Array.from({ length: 9 }, () => Array<null>(9).fill(null));
  fillGrid(grid);
  return grid;
}

/**
 * Counts solutions to `grid`, stopping early once `limit` is reached.
 * Used to confirm a puzzle has exactly one solution without solving
 * every possible branch.
 */
export function countSolutions(grid: Grid, limit: number): number {
  const working = cloneGrid(grid);
  let count = 0;

  function search(): boolean {
    const empty = findEmptyCell(working);
    if (!empty) {
      count++;
      return count >= limit;
    }

    const { row, col } = empty;
    for (const candidate of DIGITS) {
      if (!isMoveLegal(working, row, col, candidate)) continue;

      working[row][col] = candidate;
      const shouldStop = search();
      working[row][col] = null;
      if (shouldStop) return true;
    }

    return false;
  }

  search();
  return count;
}

/**
 * Removes cells from a solved grid to create a playable puzzle, only
 * keeping a removal if the resulting puzzle still has a unique solution.
 */
export function removeCells(solution: Grid, cellsToRemove: number): Grid {
  const puzzle = cloneGrid(solution);
  const positions = shuffled(
    Array.from({ length: 81 }, (_, i) => ({ row: Math.floor(i / 9), col: i % 9 })),
  );

  let removed = 0;
  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;

    const previousValue = puzzle[row][col];
    puzzle[row][col] = null;

    if (countSolutions(puzzle, 2) === 1) {
      removed++;
    } else {
      puzzle[row][col] = previousValue;
    }
  }

  return puzzle;
}

export interface GeneratedPuzzle {
  puzzle: Puzzle;
  solution: Grid;
}

/** Generates a new puzzle with a unique solution for the given difficulty. */
export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solution = generateSolvedGrid();
  const values = removeCells(solution, CELLS_TO_REMOVE[difficulty]);
  return { puzzle: { values }, solution };
}
