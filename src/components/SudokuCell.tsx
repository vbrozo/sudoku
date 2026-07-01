import type { Cell } from "../types/sudoku";
import "./SudokuCell.css";

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  onSelect: (row: number, col: number) => void;
}

export function SudokuCell({
  cell,
  row,
  col,
  isSelected,
  isPeer,
  isSameValue,
  onSelect,
}: SudokuCellProps) {
  const classNames = [
    "sudoku-cell",
    cell.locked ? "sudoku-cell--locked" : "sudoku-cell--editable",
    isSelected ? "sudoku-cell--selected" : "",
    isPeer && !isSelected ? "sudoku-cell--peer" : "",
    isSameValue && !isSelected ? "sudoku-cell--same-value" : "",
    col % 3 === 0 ? "sudoku-cell--border-left" : "",
    col === 8 ? "sudoku-cell--border-right" : "",
    row % 3 === 0 ? "sudoku-cell--border-top" : "",
    row === 8 ? "sudoku-cell--border-bottom" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => onSelect(row, col)}
      aria-label={`Row ${row + 1}, column ${col + 1}${
        cell.value ? `, value ${cell.value}` : ", empty"
      }`}
    >
      {cell.value ?? ""}
    </button>
  );
}
