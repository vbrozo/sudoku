export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;

export function boxIndex(row: number, col: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
}

export function boxOrigin(row: number, col: number): { row: number; col: number } {
  return {
    row: Math.floor(row / BOX_SIZE) * BOX_SIZE,
    col: Math.floor(col / BOX_SIZE) * BOX_SIZE,
  };
}

/** True if the two coordinates share a row, column, or 3x3 box. */
export function isPeer(
  row: number,
  col: number,
  otherRow: number,
  otherCol: number,
): boolean {
  return (
    row === otherRow ||
    col === otherCol ||
    boxIndex(row, col) === boxIndex(otherRow, otherCol)
  );
}
