import "./GameControls.css";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
  onCheck: () => void;
}

export function GameControls({ onNewGame, onResetGame, onCheck }: GameControlsProps) {
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
    </div>
  );
}
