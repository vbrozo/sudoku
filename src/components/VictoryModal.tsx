import "./VictoryModal.css";

interface VictoryModalProps {
  visible: boolean;
  onPlayAgain: () => void;
}

export function VictoryModal({ visible, onPlayAgain }: VictoryModalProps) {
  if (!visible) return null;

  return (
    <div
      className="victory-modal modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Puzzle solved"
    >
      <div className="victory-modal__card modal-card">
        <h2 className="victory-modal__title">Solved!</h2>
        <p className="victory-modal__message">You completed the puzzle.</p>
        <button
          type="button"
          className="victory-modal__button btn btn--filled-primary"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
