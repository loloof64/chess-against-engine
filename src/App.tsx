import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";

function App() {
  return (
    <main className="container">
      <div className="board">
        <ChessGame.Root>
          <ChessGame.Board />
        </ChessGame.Root>
      </div>
    </main>
  );
}

export default App;
