import { formatElapsedTime } from "../utils/time";
import "./TimerBar.css";

interface TimerBarProps {
  elapsedSeconds: number;
  paused: boolean;
  onTogglePause: () => void;
  disabled: boolean;
}

export function TimerBar({
  elapsedSeconds,
  paused,
  onTogglePause,
  disabled,
}: TimerBarProps) {
  return (
    <div className="timer-bar">
      <span className="timer-bar__time" aria-label="Elapsed time">
        {formatElapsedTime(elapsedSeconds)}
      </span>
      <button
        type="button"
        className="timer-bar__button"
        onClick={onTogglePause}
        disabled={disabled}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
