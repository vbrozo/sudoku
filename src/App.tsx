import { SudokuBoard } from "./components/SudokuBoard";
import { NumberPad } from "./components/NumberPad";
import { GameControls } from "./components/GameControls";
import { DifficultySelector } from "./components/DifficultySelector";
import { NotesToggle } from "./components/NotesToggle";
import { MistakeStatus } from "./components/MistakeStatus";
import { VictoryModal } from "./components/VictoryModal";
import { useSudoku } from "./hooks/useSudoku";
import "./App.css";

function App() {
  const {
    board,
    selected,
    difficulty,
    noteMode,
    mistakes,
    showMistakes,
    isSolved,
    selectCell,
    setValue,
    toggleNote,
    eraseValue,
    toggleNoteMode,
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
        />
        <MistakeStatus visible={showMistakes && !isSolved} mistakeCount={mistakes.length} />
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
