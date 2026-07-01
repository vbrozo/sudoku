import type { Difficulty } from "../types/sudoku";
import { combineStatistics, loadStatistics } from "../utils/statistics";
import { formatElapsedTime } from "../utils/time";
import "./StatisticsScreen.css";

interface StatisticsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ROWS: { label: string; difficulty: Difficulty }[] = [
  { label: "Easy", difficulty: "easy" },
  { label: "Medium", difficulty: "medium" },
  { label: "Hard", difficulty: "hard" },
];

export function StatisticsScreen({ visible, onClose }: StatisticsScreenProps) {
  if (!visible) return null;

  const stats = loadStatistics();
  const totals = combineStatistics(stats);

  return (
    <div
      className="statistics-screen modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Statistics"
    >
      <div className="statistics-screen__card modal-card">
        <h2 className="statistics-screen__title">Statistics</h2>
        <div className="statistics-screen__table-wrapper">
          <table className="statistics-screen__table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Played</th>
                <th>Won</th>
                <th>Best</th>
                <th>Avg</th>
                <th>Hints</th>
                <th>Miss</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ label, difficulty }) => {
                const d = stats[difficulty];
                return (
                  <tr key={difficulty}>
                    <td>{label}</td>
                    <td>{d.gamesPlayed}</td>
                    <td>{d.gamesWon}</td>
                    <td>{d.bestTimeSeconds !== null ? formatElapsedTime(d.bestTimeSeconds) : "—"}</td>
                    <td>
                      {d.gamesWon > 0
                        ? formatElapsedTime(Math.round(d.totalTimeSeconds / d.gamesWon))
                        : "—"}
                    </td>
                    <td>{d.totalHints}</td>
                    <td>{d.totalMistakes}</td>
                  </tr>
                );
              })}
              <tr className="statistics-screen__totals">
                <td>Total</td>
                <td>{totals.gamesPlayed}</td>
                <td>{totals.gamesWon}</td>
                <td>—</td>
                <td>—</td>
                <td>{totals.totalHints}</td>
                <td>{totals.totalMistakes}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="statistics-screen__close btn btn--filled-primary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
