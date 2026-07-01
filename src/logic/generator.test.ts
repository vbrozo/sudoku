import { describe, expect, it } from "vitest";
import { countSolutions, generatePuzzle, generateSolvedGrid } from "./generator";
import { isGridComplete, isGridValid } from "./validation";
import { solveGrid } from "./solver";

describe("generateSolvedGrid", () => {
  it("produces a complete, valid, filled board", () => {
    const grid = generateSolvedGrid();
    expect(isGridComplete(grid)).toBe(true);
  });

  it("produces a different board across calls (statistically)", () => {
    const a = generateSolvedGrid();
    const b = generateSolvedGrid();
    expect(a).not.toEqual(b);
  });
});

describe("generatePuzzle", () => {
  (["easy", "medium", "hard"] as const).forEach((difficulty) => {
    it(`generates a valid, uniquely solvable ${difficulty} puzzle`, () => {
      const { puzzle, solution } = generatePuzzle(difficulty);

      expect(isGridValid(puzzle.values)).toBe(true);
      expect(isGridComplete(solution)).toBe(true);
      expect(countSolutions(puzzle.values, 2)).toBe(1);
      expect(solveGrid(puzzle.values)).toEqual(solution);
    });
  });

  it("removes more cells for harder difficulties", () => {
    const countGivens = (values: (number | null)[][]) =>
      values.flat().filter((v) => v !== null).length;

    const easy = generatePuzzle("easy");
    const medium = generatePuzzle("medium");
    const hard = generatePuzzle("hard");

    expect(countGivens(easy.puzzle.values)).toBeGreaterThan(
      countGivens(medium.puzzle.values),
    );
    expect(countGivens(medium.puzzle.values)).toBeGreaterThan(
      countGivens(hard.puzzle.values),
    );
  });
});
