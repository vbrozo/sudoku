import { beforeEach, describe, expect, it } from "vitest";
import {
  combineStatistics,
  emptyStatistics,
  loadStatistics,
  recordCompletedGame,
  saveStatistics,
} from "./statistics";

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

describe("loadStatistics", () => {
  it("returns empty statistics when nothing is saved", () => {
    expect(loadStatistics()).toEqual(emptyStatistics());
  });

  it("returns empty statistics for malformed JSON", () => {
    localStorage.setItem("sudoku-statistics-v1", "{not valid json");
    expect(loadStatistics()).toEqual(emptyStatistics());
  });

  it("returns empty statistics when a difficulty bucket is missing", () => {
    localStorage.setItem("sudoku-statistics-v1", JSON.stringify({ easy: {} }));
    expect(loadStatistics()).toEqual(emptyStatistics());
  });

  it("round-trips valid saved statistics", () => {
    const stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "easy",
      elapsedSeconds: 120,
      hintsUsed: 1,
      mistakesMade: 2,
    });
    saveStatistics(stats);
    expect(loadStatistics()).toEqual(stats);
  });
});

describe("recordCompletedGame", () => {
  it("increments games played and won for the given difficulty only", () => {
    const stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "medium",
      elapsedSeconds: 100,
      hintsUsed: 0,
      mistakesMade: 0,
    });

    expect(stats.medium.gamesPlayed).toBe(1);
    expect(stats.medium.gamesWon).toBe(1);
    expect(stats.easy.gamesPlayed).toBe(0);
    expect(stats.hard.gamesPlayed).toBe(0);
  });

  it("sets best time on the first completed game", () => {
    const stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "hard",
      elapsedSeconds: 300,
      hintsUsed: 0,
      mistakesMade: 0,
    });
    expect(stats.hard.bestTimeSeconds).toBe(300);
  });

  it("lowers best time only when a faster game completes", () => {
    let stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "easy",
      elapsedSeconds: 200,
      hintsUsed: 0,
      mistakesMade: 0,
    });
    stats = recordCompletedGame(stats, {
      difficulty: "easy",
      elapsedSeconds: 90,
      hintsUsed: 0,
      mistakesMade: 0,
    });
    expect(stats.easy.bestTimeSeconds).toBe(90);

    stats = recordCompletedGame(stats, {
      difficulty: "easy",
      elapsedSeconds: 500,
      hintsUsed: 0,
      mistakesMade: 0,
    });
    expect(stats.easy.bestTimeSeconds).toBe(90);
  });

  it("accumulates total time, hints, and mistakes", () => {
    let stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "easy",
      elapsedSeconds: 100,
      hintsUsed: 2,
      mistakesMade: 3,
    });
    stats = recordCompletedGame(stats, {
      difficulty: "easy",
      elapsedSeconds: 50,
      hintsUsed: 1,
      mistakesMade: 0,
    });

    expect(stats.easy.totalTimeSeconds).toBe(150);
    expect(stats.easy.totalHints).toBe(3);
    expect(stats.easy.totalMistakes).toBe(3);
    expect(stats.easy.gamesPlayed).toBe(2);
  });

  it("does not mutate the input statistics object", () => {
    const original = emptyStatistics();
    recordCompletedGame(original, {
      difficulty: "easy",
      elapsedSeconds: 10,
      hintsUsed: 0,
      mistakesMade: 0,
    });
    expect(original).toEqual(emptyStatistics());
  });
});

describe("combineStatistics", () => {
  it("sums totals across all difficulties", () => {
    let stats = recordCompletedGame(emptyStatistics(), {
      difficulty: "easy",
      elapsedSeconds: 100,
      hintsUsed: 1,
      mistakesMade: 2,
    });
    stats = recordCompletedGame(stats, {
      difficulty: "hard",
      elapsedSeconds: 300,
      hintsUsed: 3,
      mistakesMade: 4,
    });

    expect(combineStatistics(stats)).toEqual({
      gamesPlayed: 2,
      gamesWon: 2,
      totalHints: 4,
      totalMistakes: 6,
    });
  });

  it("returns all zeros for empty statistics", () => {
    expect(combineStatistics(emptyStatistics())).toEqual({
      gamesPlayed: 0,
      gamesWon: 0,
      totalHints: 0,
      totalMistakes: 0,
    });
  });
});
