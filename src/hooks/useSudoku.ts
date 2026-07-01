import { useMemo, useState } from "react";
import type { Difficulty, Digit, GameState, Grid, Puzzle } from "../types/sudoku";
import { generatePuzzle } from "../logic/generator";
import { findMistakes, isBoardSolved } from "../logic/mistakes";
import { clearCellNotes, clearNoteFromPeers, toggleCellNote } from "../logic/notes";
import { createBoardFromPuzzle } from "../utils/board";

interface SudokuState extends GameState {
  puzzle: Puzzle;
  solution: Grid;
  difficulty: Difficulty;
  showMistakes: boolean;
  noteMode: boolean;
}

function buildState(puzzle: Puzzle, solution: Grid, difficulty: Difficulty): SudokuState {
  return {
    board: createBoardFromPuzzle(puzzle),
    selected: null,
    puzzle,
    solution,
    difficulty,
    showMistakes: false,
    noteMode: false,
  };
}

function buildNewGameState(difficulty: Difficulty): SudokuState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return buildState(puzzle, solution, difficulty);
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

      let board = prev.board.map((r) => r.slice());
      board[row] = board[row].slice();
      board[row][col] = { ...cell, value, notes: [] };
      board = clearNoteFromPeers(board, row, col, value);

      return { ...prev, board, showMistakes: false };
    });
  }

  function toggleNote(value: Digit) {
    setState((prev) => {
      if (!prev.selected) return prev;
      const { row, col } = prev.selected;
      const cell = prev.board[row][col];
      if (cell.locked || cell.value !== null) return prev;

      const board = toggleCellNote(prev.board, row, col, value);
      return { ...prev, board, showMistakes: false };
    });
  }

  function eraseValue() {
    setState((prev) => {
      if (!prev.selected) return prev;
      const { row, col } = prev.selected;
      const cell = prev.board[row][col];
      if (cell.locked) return prev;

      if (prev.noteMode) {
        const board = clearCellNotes(prev.board, row, col);
        if (board === prev.board) return prev;
        return { ...prev, board, showMistakes: false };
      }

      if (cell.value === null) return prev;
      const board = prev.board.map((r) => r.slice());
      board[row] = board[row].slice();
      board[row][col] = { ...cell, value: null };
      return { ...prev, board, showMistakes: false };
    });
  }

  function toggleNoteMode() {
    setState((prev) => ({ ...prev, noteMode: !prev.noteMode }));
  }

  function newGame(difficulty?: Difficulty) {
    setState((prev) => buildNewGameState(difficulty ?? prev.difficulty));
  }

  function resetGame() {
    setState((prev) => buildState(prev.puzzle, prev.solution, prev.difficulty));
  }

  function checkPuzzle() {
    setState((prev) => ({ ...prev, showMistakes: true }));
  }

  const mistakes = useMemo(
    () => (state.showMistakes ? findMistakes(state.board, state.solution) : []),
    [state.board, state.solution, state.showMistakes],
  );

  const isSolved = useMemo(
    () => isBoardSolved(state.board, state.solution),
    [state.board, state.solution],
  );

  return {
    board: state.board,
    selected: state.selected,
    difficulty: state.difficulty,
    noteMode: state.noteMode,
    mistakes,
    showMistakes: state.showMistakes,
    isSolved,
    selectCell,
    setValue,
    toggleNote,
    eraseValue,
    toggleNoteMode,
    newGame,
    resetGame,
    checkPuzzle,
  };
}
