import type { Cell, Digit } from "../types/sudoku";
import "./SudokuCell.css";

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  isMistake: boolean;
  onSelect: (row: number, col: number) => void;
}

const NOTE_DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SudokuCell({
  cell,
  row,
  col,
  isSelected,
  isPeer,
  isSameValue,
  isMistake,
  onSelect,
}: SudokuCellProps) {
  const classNames = [
    "sudoku-cell",
    cell.locked ? "sudoku-cell--locked" : "sudoku-cell--editable",
    isSelected ? "sudoku-cell--selected" : "",
    isPeer && !isSelected ? "sudoku-cell--peer" : "",
    isSameValue && !isSelected ? "sudoku-cell--same-value" : "",
    isMistake ? "sudoku-cell--mistake" : "",
    cell.hinted && !isMistake ? "sudoku-cell--hinted" : "",
    col % 3 === 0 ? "sudoku-cell--border-left" : "",
    col === 8 ? "sudoku-cell--border-right" : "",
    row % 3 === 0 ? "sudoku-cell--border-top" : "",
    row === 8 ? "sudoku-cell--border-bottom" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const hasNotes = cell.value === null && cell.notes.length > 0;

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => onSelect(row, col)}
      aria-label={`Row ${row + 1}, column ${col + 1}${
        cell.value ? `, value ${cell.value}` : ", empty"
      }`}
    >
      {cell.value ?? (hasNotes ? <CellNotes notes={cell.notes} /> : "")}
    </button>
  );
}

function CellNotes({ notes }: { notes: Digit[] }) {
  return (
    <span className="sudoku-cell__notes">
      {NOTE_DIGITS.map((digit) => (
        <span key={digit} className="sudoku-cell__note">
          {notes.includes(digit) ? digit : ""}
        </span>
      ))}
    </span>
  );
}
