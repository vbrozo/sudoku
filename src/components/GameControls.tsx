import "./GameControls.css";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
  onCheck: () => void;
  onHint: () => void;
  hintDisabled: boolean;
}

export function GameControls({
  onNewGame,
  onResetGame,
  onCheck,
  onHint,
  hintDisabled,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <button type="button" className="game-controls__button" onClick={onNewGame}>
        New Game
      </button>
      <button type="button" className="game-controls__button" onClick={onResetGame}>
        Reset Game
      </button>
      <button type="button" className="game-controls__button" onClick={onCheck}>
        Check
      </button>
      <button
        type="button"
        className="game-controls__button"
        onClick={onHint}
        disabled={hintDisabled}
      >
        Hint
      </button>
    </div>
  );
}
