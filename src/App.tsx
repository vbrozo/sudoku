import { SudokuBoard } from "./components/SudokuBoard";
import { NumberPad } from "./components/NumberPad";
import { GameControls } from "./components/GameControls";
import { DifficultySelector } from "./components/DifficultySelector";
import { NotesToggle } from "./components/NotesToggle";
import { MistakeStatus } from "./components/MistakeStatus";
import { HintStatus } from "./components/HintStatus";
import { TimerBar } from "./components/TimerBar";
import { PauseOverlay } from "./components/PauseOverlay";
import { VictoryModal } from "./components/VictoryModal";
import { ChoiceDialog } from "./components/ChoiceDialog";
import { useSudoku } from "./hooks/useSudoku";
import "./App.css";

function App() {
  const {
    board,
    selected,
    difficulty,
    noteMode,
    hintCount,
    mistakes,
    showMistakes,
    isSolved,
    paused,
    elapsedSeconds,
    togglePause,
    hasSavedGame,
    continueSavedGame,
    dismissSavedGame,
    confirmingNewGame,
    confirmNewGame,
    cancelNewGame,
    selectCell,
    setValue,
    toggleNote,
    eraseValue,
    toggleNoteMode,
    useHint,
    newGame,
    resetGame,
    checkPuzzle,
  } = useSudoku();

  return (
    <div className="app">
      <header className="app__header">
        <h1>Sudoku</h1>
      </header>
      <main className="app__main">
        <TimerBar
          elapsedSeconds={elapsedSeconds}
          paused={paused}
          onTogglePause={togglePause}
          disabled={isSolved}
        />
        <DifficultySelector difficulty={difficulty} onSelect={newGame} />
        <GameControls
          onNewGame={() => newGame()}
          onResetGame={resetGame}
          onCheck={checkPuzzle}
          onHint={useHint}
          hintDisabled={isSolved || paused}
        />
        <MistakeStatus visible={showMistakes && !isSolved} mistakeCount={mistakes.length} />
        <HintStatus hintCount={hintCount} />
        <div className={"game-board-area" + (paused ? " game-board-area--paused" : "")}>
          <SudokuBoard
            board={board}
            selected={selected}
            mistakes={mistakes}
            onSelectCell={selectCell}
          />
          {paused && <PauseOverlay />}
        </div>
        <NotesToggle active={noteMode} onToggle={toggleNoteMode} />
        <NumberPad
          onNumberSelect={noteMode ? toggleNote : setValue}
          onErase={eraseValue}
          disabled={!selected || paused}
        />
      </main>
      <VictoryModal visible={isSolved} onPlayAgain={() => newGame()} />
      <ChoiceDialog
        visible={hasSavedGame}
        title="Resume your game?"
        message="You have a saved game in progress."
        primaryLabel="Continue Game"
        secondaryLabel="Start New Game"
        onPrimary={continueSavedGame}
        onSecondary={dismissSavedGame}
      />
      <ChoiceDialog
        visible={confirmingNewGame}
        title="Start a new game?"
        message="Your current progress will be lost."
        primaryLabel="Start New Game"
        secondaryLabel="Cancel"
        onPrimary={confirmNewGame}
        onSecondary={cancelNewGame}
      />
    </div>
  );
}

export default App;
