import "./MistakeStatus.css";

interface MistakeStatusProps {
  visible: boolean;
  mistakeCount: number;
}

export function MistakeStatus({ visible, mistakeCount }: MistakeStatusProps) {
  if (!visible) return null;

  const message =
    mistakeCount === 0
      ? "No mistakes so far!"
      : `${mistakeCount} mistake${mistakeCount === 1 ? "" : "s"} found`;

  return (
    <p
      className={
        "mistake-status" +
        (mistakeCount === 0 ? " mistake-status--ok" : " mistake-status--error")
      }
      role="status"
    >
      {message}
    </p>
  );
}
