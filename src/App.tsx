import { SudokuBoard } from "./components/SudokuBoard";
import { NumberPad } from "./components/NumberPad";
import { GameControls } from "./components/GameControls";
import { DifficultySelector } from "./components/DifficultySelector";
import { NotesToggle } from "./components/NotesToggle";
import { MistakeStatus } from "./components/MistakeStatus";
import { HintStatus } from "./components/HintStatus";
import { VictoryModal } from "./components/VictoryModal";
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
        <DifficultySelector difficulty={difficulty} onSelect={newGame} />
        <GameControls
          onNewGame={() => newGame()}
          onResetGame={resetGame}
          onCheck={checkPuzzle}
          onHint={useHint}
          hintDisabled={isSolved}
        />
        <MistakeStatus visible={showMistakes && !isSolved} mistakeCount={mistakes.length} />
        <HintStatus hintCount={hintCount} />
        <SudokuBoard
          board={board}
          selected={selected}
          mistakes={mistakes}
          onSelectCell={selectCell}
        />
        <NotesToggle active={noteMode} onToggle={toggleNoteMode} />
        <NumberPad
          onNumberSelect={noteMode ? toggleNote : setValue}
          onErase={eraseValue}
          disabled={!selected}
        />
      </main>
      <VictoryModal visible={isSolved} onPlayAgain={() => newGame()} />
    </div>
  );
}

export default App;
