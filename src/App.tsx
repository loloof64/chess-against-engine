import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";
import MovesHistory from "./components/MovesHistory";

function App() {
  return (
    <main className="container">
      <div className="board">
        <ChessGame.Root>
          <ChessGame.Board />
        </ChessGame.Root>
      </div>
      <MovesHistory />
    </main>
  );
}

export default App;
