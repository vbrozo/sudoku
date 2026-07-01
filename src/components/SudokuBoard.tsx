import type { Board } from "../types/sudoku";
import { isPeer } from "../logic/rules";
import { SudokuCell } from "./SudokuCell";
import "./SudokuBoard.css";

interface SudokuBoardProps {
  board: Board;
  selected: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
}

export function SudokuBoard({ board, selected, onSelectCell }: SudokuBoardProps) {
  const selectedValue = selected ? board[selected.row][selected.col].value : null;

  return (
    <div className="sudoku-board" role="grid" aria-label="Sudoku board">
      {board.map((rowCells, row) =>
        rowCells.map((cell, col) => {
          const isSelected = selected?.row === row && selected?.col === col;
          const isPeerCell = selected
            ? isPeer(row, col, selected.row, selected.col)
            : false;
          const isSameValue = Boolean(
            selectedValue !== null && cell.value === selectedValue,
          );

          return (
            <SudokuCell
              key={`${row}-${col}`}
              cell={cell}
              row={row}
              col={col}
              isSelected={isSelected}
              isPeer={isPeerCell}
              isSameValue={isSameValue}
              onSelect={onSelectCell}
            />
          );
        }),
      )}
    </div>
  );
}
