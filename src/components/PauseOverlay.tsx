import "./PauseOverlay.css";

export function PauseOverlay() {
  return (
    <div className="pause-overlay" role="status">
      <span className="pause-overlay__text">Paused</span>
    </div>
  );
}
