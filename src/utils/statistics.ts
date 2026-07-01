import type { Difficulty } from "../types/sudoku";

const STORAGE_KEY = "sudoku-statistics-v1";

export interface DifficultyStatistics {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: number | null;
  totalTimeSeconds: number;
  totalHints: number;
  totalMistakes: number;
}

export type Statistics = Record<Difficulty, DifficultyStatistics>;

export interface CombinedStatistics {
  gamesPlayed: number;
  gamesWon: number;
  totalHints: number;
  totalMistakes: number;
}

function emptyDifficultyStatistics(): DifficultyStatistics {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    bestTimeSeconds: null,
    totalTimeSeconds: 0,
    totalHints: 0,
    totalMistakes: 0,
  };
}

export function emptyStatistics(): Statistics {
  return {
    easy: emptyDifficultyStatistics(),
    medium: emptyDifficultyStatistics(),
    hard: emptyDifficultyStatistics(),
  };
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidDifficultyStatistics(data: unknown): data is DifficultyStatistics {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  return (
    isNonNegativeInteger(d.gamesPlayed) &&
    isNonNegativeInteger(d.gamesWon) &&
    (d.bestTimeSeconds === null || isNonNegativeInteger(d.bestTimeSeconds)) &&
    isNonNegativeInteger(d.totalTimeSeconds) &&
    isNonNegativeInteger(d.totalHints) &&
    isNonNegativeInteger(d.totalMistakes)
  );
}

function isValidStatistics(data: unknown): data is Statistics {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return DIFFICULTIES.every((difficulty) => isValidDifficultyStatistics(d[difficulty]));
}

/** Loads saved statistics, falling back to empty stats if nothing is saved or the data is corrupted. */
export function loadStatistics(): Statistics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStatistics();

    const parsed: unknown = JSON.parse(raw);
    return isValidStatistics(parsed) ? parsed : emptyStatistics();
  } catch {
    return emptyStatistics();
  }
}

export function saveStatistics(stats: Statistics): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore — storage may be unavailable
  }
}

export interface CompletedGame {
  difficulty: Difficulty;
  elapsedSeconds: number;
  hintsUsed: number;
  mistakesMade: number;
}

/** Pure update: folds one completed game into the statistics, returning a new object. */
export function recordCompletedGame(stats: Statistics, game: CompletedGame): Statistics {
  const current = stats[game.difficulty];
  const updated: DifficultyStatistics = {
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: current.gamesWon + 1,
    bestTimeSeconds:
      current.bestTimeSeconds === null
        ? game.elapsedSeconds
        : Math.min(current.bestTimeSeconds, game.elapsedSeconds),
    totalTimeSeconds: current.totalTimeSeconds + game.elapsedSeconds,
    totalHints: current.totalHints + game.hintsUsed,
    totalMistakes: current.totalMistakes + game.mistakesMade,
  };

  return { ...stats, [game.difficulty]: updated };
}

export function combineStatistics(stats: Statistics): CombinedStatistics {
  return DIFFICULTIES.reduce<CombinedStatistics>(
    (totals, difficulty) => {
      const d = stats[difficulty];
      return {
        gamesPlayed: totals.gamesPlayed + d.gamesPlayed,
        gamesWon: totals.gamesWon + d.gamesWon,
        totalHints: totals.totalHints + d.totalHints,
        totalMistakes: totals.totalMistakes + d.totalMistakes,
      };
    },
    { gamesPlayed: 0, gamesWon: 0, totalHints: 0, totalMistakes: 0 },
  );
}
