import type { CellValue, Grid } from "../types/sudoku";
import { BOARD_SIZE, boxOrigin } from "./rules";

export interface Position {
  row: number;
  col: number;
}

export function getRowValues(grid: Grid, row: number): CellValue[] {
  return grid[row];
}

export function getColumnValues(grid: Grid, col: number): CellValue[] {
  return grid.map((row) => row[col]);
}

export function getBoxValues(grid: Grid, row: number, col: number): CellValue[] {
  const { row: originRow, col: originCol } = boxOrigin(row, col);
  const values: CellValue[] = [];
  for (let r = originRow; r < originRow + 3; r++) {
    for (let c = originCol; c < originCol + 3; c++) {
      values.push(grid[r][c]);
    }
  }
  return values;
}

/** Returns the values that appear more than once, ignoring empty cells. */
function findDuplicateValues(values: CellValue[]): Set<CellValue> {
  const seen = new Set<CellValue>();
  const duplicates = new Set<CellValue>();
  for (const value of values) {
    if (value === null) continue;
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }
  return duplicates;
}

export function isRowValid(grid: Grid, row: number): boolean {
  return findDuplicateValues(getRowValues(grid, row)).size === 0;
}

export function isColumnValid(grid: Grid, col: number): boolean {
  return findDuplicateValues(getColumnValues(grid, col)).size === 0;
}

export function isBoxValid(grid: Grid, row: number, col: number): boolean {
  return findDuplicateValues(getBoxValues(grid, row, col)).size === 0;
}

/** True if no row, column, or box currently contains a duplicate value. */
export function isGridValid(grid: Grid): boolean {
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (!isRowValid(grid, i) || !isColumnValid(grid, i)) return false;
  }
  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += 3) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += 3) {
      if (!isBoxValid(grid, boxRow, boxCol)) return false;
    }
  }
  return true;
}

/** Every cell that participates in a row, column, or box duplicate. */
export function findConflicts(grid: Grid): Position[] {
  const conflicts: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = grid[row][col];
      if (value === null) continue;

      const rowDuplicates = findDuplicateValues(getRowValues(grid, row));
      const colDuplicates = findDuplicateValues(getColumnValues(grid, col));
      const boxDuplicates = findDuplicateValues(getBoxValues(grid, row, col));

      if (
        rowDuplicates.has(value) ||
        colDuplicates.has(value) ||
        boxDuplicates.has(value)
      ) {
        conflicts.push({ row, col });
      }
    }
  }

  return conflicts;
}

/**
 * Whether `value` can legally be placed at (row, col): no equal value already
 * present among that cell's row, column, or box peers.
 */
export function isMoveLegal(
  grid: Grid,
  row: number,
  col: number,
  value: CellValue,
): boolean {
  if (value === null) return true;

  const conflictsInRow = getRowValues(grid, row).some(
    (v, c) => c !== col && v === value,
  );
  if (conflictsInRow) return false;

  const conflictsInColumn = getColumnValues(grid, col).some(
    (v, r) => r !== row && v === value,
  );
  if (conflictsInColumn) return false;

  const { row: originRow, col: originCol } = boxOrigin(row, col);
  for (let r = originRow; r < originRow + 3; r++) {
    for (let c = originCol; c < originCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) return false;
    }
  }

  return true;
}

export function isGridComplete(grid: Grid): boolean {
  const isFull = grid.every((row) => row.every((value) => value !== null));
  return isFull && isGridValid(grid);
}
