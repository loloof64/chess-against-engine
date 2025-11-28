import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";
import Game from "./components/game/Game";

function App() {
  return (
    <main className="container">
      <ChessGame.Root>
        <Game />
      </ChessGame.Root>
    </main>
  );
}

export default App;
