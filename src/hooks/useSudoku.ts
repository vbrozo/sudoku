import { useState } from "react";
import type { Difficulty, Digit, GameState, Puzzle } from "../types/sudoku";
import { generatePuzzle } from "../logic/generator";
import { createBoardFromPuzzle } from "../utils/board";

interface SudokuState extends GameState {
  puzzle: Puzzle;
  difficulty: Difficulty;
}

function buildState(puzzle: Puzzle, difficulty: Difficulty): SudokuState {
  return {
    board: createBoardFromPuzzle(puzzle),
    selected: null,
    puzzle,
    difficulty,
  };
}

function buildNewGameState(difficulty: Difficulty): SudokuState {
  const { puzzle } = generatePuzzle(difficulty);
  return buildState(puzzle, difficulty);
}

const DEFAULT_DIFFICULTY: Difficulty = "easy";

export function useSudoku() {
  const [state, setState] = useState<SudokuState>(() =>
    buildNewGameState(DEFAULT_DIFFICULTY),
  );

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

  function newGame(difficulty?: Difficulty) {
    setState((prev) => buildNewGameState(difficulty ?? prev.difficulty));
  }

  function resetGame() {
    setState((prev) => buildState(prev.puzzle, prev.difficulty));
  }

  return {
    board: state.board,
    selected: state.selected,
    difficulty: state.difficulty,
    selectCell,
    setValue,
    eraseValue,
    newGame,
    resetGame,
  };
}
