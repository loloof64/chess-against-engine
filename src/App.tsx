import "./App.css";
import { EngineSelector } from "./components/EngineSelector";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import GameProvider from "./stores/game/GameContext";
import PositionEditorProvider from "./stores/game/PositionEditorContext";
import getPlatformKind, { PlatformKind } from "./utils/PlatformKind";

function App() {
  return (
    <GameProvider>
      <PositionEditorProvider>
        <main className="container">
          {getPlatformKind() === PlatformKind.android ? (
            <div style={{ marginTop: "20px" }}>
              <EngineSelector />
            </div>
          ) : (
            <>
              <Toolbar />
              <Game />
            </>
          )}
        </main>
      </PositionEditorProvider>
    </GameProvider>
  );
}

export default App;
