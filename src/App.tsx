import { SudokuBoard } from "./components/SudokuBoard";
import { NumberPad } from "./components/NumberPad";
import { useSudoku } from "./hooks/useSudoku";
import "./App.css";

function App() {
  const { board, selected, selectCell, setValue, eraseValue } = useSudoku();

  return (
    <div className="app">
      <header className="app__header">
        <h1>Sudoku</h1>
      </header>
      <main className="app__main">
        <SudokuBoard board={board} selected={selected} onSelectCell={selectCell} />
        <NumberPad
          onNumberSelect={setValue}
          onErase={eraseValue}
          disabled={!selected}
        />
      </main>
    </div>
  );
}

export default App;
