import type { Board, CellValue, Difficulty, Grid, Puzzle } from "../types/sudoku";

const STORAGE_KEY = "sudoku-game-v1";

export interface PersistedGame {
  board: Board;
  puzzle: Puzzle;
  solution: Grid;
  difficulty: Difficulty;
  showMistakes: boolean;
  noteMode: boolean;
  hintCount: number;
  paused: boolean;
  elapsedSeconds: number;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function isDigitOrNull(value: unknown): value is CellValue {
  return (
    value === null ||
    (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 9)
  );
}

function isValidGrid(grid: unknown): grid is Grid {
  return (
    Array.isArray(grid) &&
    grid.length === 9 &&
    grid.every((row) => Array.isArray(row) && row.length === 9 && row.every(isDigitOrNull))
  );
}

function isValidCell(cell: unknown): boolean {
  if (typeof cell !== "object" || cell === null) return false;
  const c = cell as Record<string, unknown>;
  return (
    isDigitOrNull(c.value) &&
    typeof c.locked === "boolean" &&
    Array.isArray(c.notes) &&
    c.notes.every((n) => typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 9) &&
    typeof c.hinted === "boolean"
  );
}

function isValidBoard(board: unknown): board is Board {
  return (
    Array.isArray(board) &&
    board.length === 9 &&
    board.every((row) => Array.isArray(row) && row.length === 9 && row.every(isValidCell))
  );
}

function isValidPuzzle(puzzle: unknown): puzzle is Puzzle {
  if (typeof puzzle !== "object" || puzzle === null) return false;
  return isValidGrid((puzzle as Record<string, unknown>).values);
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidPersistedGame(data: unknown): data is PersistedGame {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  return (
    isValidBoard(d.board) &&
    isValidPuzzle(d.puzzle) &&
    isValidGrid(d.solution) &&
    typeof d.difficulty === "string" &&
    DIFFICULTIES.includes(d.difficulty as Difficulty) &&
    typeof d.showMistakes === "boolean" &&
    typeof d.noteMode === "boolean" &&
    isNonNegativeInteger(d.hintCount) &&
    typeof d.paused === "boolean" &&
    isNonNegativeInteger(d.elapsedSeconds)
  );
}

/** Persists the game. Silently no-ops if storage is unavailable (private browsing, quota, disabled). */
export function saveGame(game: PersistedGame): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {
    // ignore
  }
}

/** Loads the saved game, returning null if nothing is saved or the data is corrupted/invalid. */
export function loadGame(): PersistedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isValidPersistedGame(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
