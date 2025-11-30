import "./App.css";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import GameProvider from "./stores/game/GameContext";

function App() {
  return (
    <GameProvider>
      <main className="container">
        <Toolbar />
        <Game />
      </main>
    </GameProvider>
  );
}

export default App;
