import "./HintStatus.css";

interface HintStatusProps {
  hintCount: number;
}

export function HintStatus({ hintCount }: HintStatusProps) {
  if (hintCount === 0) return null;

  return (
    <p className="hint-status" role="status">
      {hintCount} hint{hintCount === 1 ? "" : "s"} used
    </p>
  );
}
