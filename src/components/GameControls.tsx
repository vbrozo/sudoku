import "./GameControls.css";

interface GameControlsProps {
  onNewGame: () => void;
  onResetGame: () => void;
}

export function GameControls({ onNewGame, onResetGame }: GameControlsProps) {
  return (
    <div className="game-controls">
      <button type="button" className="game-controls__button" onClick={onNewGame}>
        New Game
      </button>
      <button type="button" className="game-controls__button" onClick={onResetGame}>
        Reset Game
      </button>
    </div>
  );
}
