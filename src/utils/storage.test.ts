import { beforeEach, describe, expect, it } from "vitest";
import type { Board, Grid, Puzzle } from "../types/sudoku";
import { clearSavedGame, loadGame, saveGame, type PersistedGame } from "./storage";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

function emptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array<null>(9).fill(null));
}

function emptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, locked: false, notes: [], hinted: false })),
  );
}

function samplePersistedGame(): PersistedGame {
  const puzzle: Puzzle = { values: emptyGrid() };
  return {
    board: emptyBoard(),
    puzzle,
    solution: emptyGrid(),
    difficulty: "easy",
    showMistakes: false,
    noteMode: false,
    hintCount: 0,
    paused: false,
    elapsedSeconds: 0,
  };
}

describe("saveGame / loadGame", () => {
  it("round-trips a valid game", () => {
    const game = samplePersistedGame();
    saveGame(game);
    expect(loadGame()).toEqual(game);
  });

  it("returns null when nothing has been saved", () => {
    expect(loadGame()).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    localStorage.setItem("sudoku-game-v1", "{not valid json");
    expect(loadGame()).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    localStorage.setItem("sudoku-game-v1", JSON.stringify({ difficulty: "easy" }));
    expect(loadGame()).toBeNull();
  });

  it("returns null when the board has the wrong shape", () => {
    const game = samplePersistedGame();
    game.board = game.board.slice(0, 3);
    localStorage.setItem("sudoku-game-v1", JSON.stringify(game));
    expect(loadGame()).toBeNull();
  });

  it("returns null for an invalid difficulty value", () => {
    const game = samplePersistedGame();
    // @ts-expect-error intentionally corrupting the value for the test
    game.difficulty = "impossible";
    localStorage.setItem("sudoku-game-v1", JSON.stringify(game));
    expect(loadGame()).toBeNull();
  });

  it("returns null for a cell with an out-of-range value", () => {
    const game = samplePersistedGame();
    game.board[0][0] = { value: 42 as never, locked: false, notes: [], hinted: false };
    localStorage.setItem("sudoku-game-v1", JSON.stringify(game));
    expect(loadGame()).toBeNull();
  });
});

describe("clearSavedGame", () => {
  it("removes the saved game", () => {
    saveGame(samplePersistedGame());
    clearSavedGame();
    expect(loadGame()).toBeNull();
  });

  it("does not throw when there is nothing saved", () => {
    expect(() => clearSavedGame()).not.toThrow();
  });
});
