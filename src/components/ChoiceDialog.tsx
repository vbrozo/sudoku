import "./ChoiceDialog.css";

interface ChoiceDialogProps {
  visible: boolean;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export function ChoiceDialog({
  visible,
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: ChoiceDialogProps) {
  if (!visible) return null;

  return (
    <div
      className="choice-dialog modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="choice-dialog__card modal-card">
        <h2 className="choice-dialog__title">{title}</h2>
        <p className="choice-dialog__message">{message}</p>
        <div className="choice-dialog__actions">
          <button
            type="button"
            className="choice-dialog__button choice-dialog__button--primary btn btn--filled-primary"
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="choice-dialog__button choice-dialog__button--secondary btn btn--outline-primary"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
