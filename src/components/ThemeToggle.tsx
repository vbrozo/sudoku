import type { ThemeMode } from "../hooks/useTheme";
import "./ThemeToggle.css";

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

const LABELS: Record<ThemeMode, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Theme: ${LABELS[mode]}. Tap to change.`}
    >
      {LABELS[mode]}
    </button>
  );
}
