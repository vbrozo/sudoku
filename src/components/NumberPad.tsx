import "./NumberPad.css";

interface NumberPadProps {
  onNumberSelect: (value: number) => void;
  onErase: () => void;
  disabled: boolean;
}

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function NumberPad({ onNumberSelect, onErase, disabled }: NumberPadProps) {
  return (
    <div className="number-pad">
      {NUMBERS.map((number) => (
        <button
          key={number}
          type="button"
          className="number-pad__button"
          onClick={() => onNumberSelect(number)}
          disabled={disabled}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className="number-pad__button number-pad__button--erase"
        onClick={onErase}
        disabled={disabled}
        aria-label="Erase"
      >
        Erase
      </button>
    </div>
  );
}
