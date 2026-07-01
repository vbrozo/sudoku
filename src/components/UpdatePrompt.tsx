import { useRegisterSW } from "virtual:pwa-register/react";
import "./UpdatePrompt.css";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-prompt" role="status">
      <span className="update-prompt__text">A new version is available.</span>
      <button
        type="button"
        className="update-prompt__button"
        onClick={() => updateServiceWorker(true)}
      >
        Update
      </button>
      <button
        type="button"
        className="update-prompt__dismiss"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
