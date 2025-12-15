import "./App.css";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import GameProvider from "./stores/game/GameContext";
import PositionEditorProvider from "./stores/game/PositionEditorContext";

function App() {
  return (
    <GameProvider>
      <PositionEditorProvider>
        <main className="container">
          <Toolbar />
          <Game />
        </main>
      </PositionEditorProvider>
    </GameProvider>
  );
}

export default App;
