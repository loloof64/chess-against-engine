import { useEffect, useRef, useState } from "react";
import "./App.css";
import { AndroidEngineSelector } from "./components/AndroidEngineSelector";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import { useAndroidEngineProcess } from "./hooks/engine/AndroidEngineProcessContext";
import { useDesktopEngineProcess } from "./hooks/engine/DesktopEngineProcessContext";

import getPlatformKind, { PlatformKind } from "./utils/PlatformKind";
import Clock from "./components/clock/Clock";
import { useGame } from "./stores/game/GameContext";

function App() {
  const { engineProcess: androidEngineProcess } = useAndroidEngineProcess();
  const { useClock } = useGame();
  const {
    startEngineProcess: startDesktopEngine,
    stopEngineProcess: stopDesktopEngine,
  } = useDesktopEngineProcess();
  const [showEngineSelector, setShowEngineSelector] = useState(false);
  const desktopEngineStartedRef = useRef(false);

  useEffect(() => {
    setShowEngineSelector(
      () =>
        getPlatformKind() === PlatformKind.android &&
        androidEngineProcess === null
    );
  }, [androidEngineProcess]);

  // Start desktop engine on app load - only once
  useEffect(() => {
    if (
      getPlatformKind() === PlatformKind.desktop &&
      !desktopEngineStartedRef.current
    ) {
      desktopEngineStartedRef.current = true;
      startDesktopEngine();
    }

    return () => {
      if (desktopEngineStartedRef.current) {
        stopDesktopEngine();
      }
    };
  }, []);

  return (
    <main className="container">
      {showEngineSelector ? (
        <div style={{ marginTop: "20px" }}>
          <AndroidEngineSelector />
        </div>
      ) : (
        <>
          <Toolbar />
          {useClock && <Clock />}
          <Game />
        </>
      )}
    </main>
  );
}

export default App;
