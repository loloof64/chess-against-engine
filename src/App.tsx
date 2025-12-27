import { useEffect, useState } from "react";
import "./App.css";
import { EngineSelector } from "./components/EngineSelector";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import { useEngineProcess } from "./stores/game/AndroidEngineProcessContext";

import getPlatformKind, { PlatformKind } from "./utils/PlatformKind";

function App() {
  const { engineProcess } = useEngineProcess();
  const [showEngineSelector, setShowEngineSelector] = useState(false);

  useEffect(() => {
    setShowEngineSelector(
      () => getPlatformKind() === PlatformKind.android && engineProcess === null
    );
  }, [engineProcess]);

  return (
    <main className="container">
      {showEngineSelector ? (
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
  );
}

export default App;
