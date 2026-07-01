import { describe, expect, it } from "vitest";
import type { Board } from "../types/sudoku";
import { findHintCell } from "./hints";

function makeBoard(overrides: Partial<{ locked: boolean; value: number | null }>[][]): Board {
  return overrides.map((row) =>
    row.map((cell) => ({
      value: (cell.value ?? null) as Board[number][number]["value"],
      locked: cell.locked ?? false,
      notes: [],
      hinted: false,
    })),
  );
}

function emptyGrid(): Partial<{ locked: boolean; value: number | null }>[][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => ({})));
}

describe("findHintCell", () => {
  it("returns the first empty, editable cell in row-major order", () => {
    const grid = emptyGrid();
    grid[0][0] = { locked: true, value: 5 };
    grid[0][1] = { value: 3 }; // filled but editable, not a hint target
    const board = makeBoard(grid);

    expect(findHintCell(board)).toEqual({ row: 0, col: 2 });
  });

  it("skips locked cells even if they come first", () => {
    const grid = emptyGrid();
    for (let col = 0; col < 9; col++) grid[0][col] = { locked: true, value: 1 };
    const board = makeBoard(grid);

    expect(findHintCell(board)).toEqual({ row: 1, col: 0 });
  });

  it("returns null when there are no empty editable cells", () => {
    const grid = emptyGrid();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        grid[row][col] = { value: 1 };
      }
    }
    const board = makeBoard(grid);

    expect(findHintCell(board)).toBeNull();
  });
});
