import type { Difficulty } from "../types/sudoku";
import "./DifficultySelector.css";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function DifficultySelector({ difficulty, onSelect }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector" role="radiogroup" aria-label="Difficulty">
      {DIFFICULTIES.map((level) => (
        <button
          key={level}
          type="button"
          role="radio"
          aria-checked={level === difficulty}
          className={
            "difficulty-selector__button" +
            (level === difficulty ? " difficulty-selector__button--active" : "")
          }
          onClick={() => onSelect(level)}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
}
