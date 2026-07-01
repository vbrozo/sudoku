import { useState } from "react";
import type { Digit, GameState } from "../types/sudoku";
import { puzzles } from "../data/puzzles";
import { createBoardFromPuzzle } from "../utils/board";

interface SudokuState extends GameState {
  puzzleIndex: number;
}

function buildInitialState(puzzleIndex: number): SudokuState {
  return {
    board: createBoardFromPuzzle(puzzles[puzzleIndex]),
    selected: null,
    puzzleIndex,
  };
}

export function useSudoku() {
  const [state, setState] = useState<SudokuState>(() => buildInitialState(0));

  function selectCell(row: number, col: number) {
    setState((prev) => ({ ...prev, selected: { row, col } }));
  }

  function setValue(value: Digit) {
    if (!Number.isInteger(value) || value < 1 || value > 9) return;

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

  function newGame() {
    setState((prev) => buildInitialState((prev.puzzleIndex + 1) % puzzles.length));
  }

  function resetGame() {
    setState((prev) => buildInitialState(prev.puzzleIndex));
  }

  return {
    board: state.board,
    selected: state.selected,
    selectCell,
    setValue,
    eraseValue,
    newGame,
    resetGame,
  };
}
