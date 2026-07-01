import { useMemo, useState } from "react";
import type { GameState } from "../types/sudoku";
import { samplePuzzle } from "../data/samplePuzzle";
import { createBoardFromPuzzle } from "../utils/board";

export function useSudoku() {
  const initialBoard = useMemo(() => createBoardFromPuzzle(samplePuzzle), []);
  const [state, setState] = useState<GameState>({
    board: initialBoard,
    selected: null,
  });

  function selectCell(row: number, col: number) {
    setState((prev) => ({ ...prev, selected: { row, col } }));
  }

  function setValue(value: number) {
    setState((prev) => {
      if (!prev.selected) return prev;
      const { row, col } = prev.selected;
      const cell = prev.board[row][col];
      if (cell.locked) return prev;

      const board = prev.board.map((r) => r.slice());
      board[row] = board[row].slice();
      board[row][col] = { ...cell, value };
      return { ...prev, board };
    });
  }

  function eraseValue() {
    setState((prev) => {
      if (!prev.selected) return prev;
      const { row, col } = prev.selected;
      const cell = prev.board[row][col];
      if (cell.locked || cell.value === null) return prev;

      const board = prev.board.map((r) => r.slice());
      board[row] = board[row].slice();
      board[row][col] = { ...cell, value: null };
      return { ...prev, board };
    });
  }

  return {
    board: state.board,
    selected: state.selected,
    selectCell,
    setValue,
    eraseValue,
  };
}
