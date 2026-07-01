import "./NotesToggle.css";

interface NotesToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function NotesToggle({ active, onToggle }: NotesToggleProps) {
  return (
    <button
      type="button"
      className={
        "notes-toggle btn btn--outline-neutral" + (active ? " notes-toggle--active" : "")
      }
      onClick={onToggle}
      aria-pressed={active}
    >
      Notes: {active ? "On" : "Off"}
    </button>
  );
}
