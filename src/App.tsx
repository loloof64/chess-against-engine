import { useEffect, useRef, useState } from "react";
import "./App.css";
import { AndroidEngineSelector } from "./components/AndroidEngineSelector";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import { useAndroidEngineProcess } from "./hooks/engine/AndroidEngineProcessContext";
import { useDesktopEngineProcess } from "./hooks/engine/DesktopEngineProcessContext";

import getPlatformKind, { PlatformKind } from "./utils/PlatformKind";
import { useUniformEngineCommunication } from "./hooks/engine/UniformEngineCommunication";

function App() {
  const { engineProcess: androidEngineProcess } = useAndroidEngineProcess();
  const {
    startEngineProcess: startDesktopEngine,
    engineProcess: desktopEngineProcess,
  } = useDesktopEngineProcess();
  const [showEngineSelector, setShowEngineSelector] = useState(false);
  /* TODO remove */
  const { sendCommandToInstalledEngine } = useUniformEngineCommunication();
  const commandInput = useRef<HTMLInputElement | null>(null);
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
          <Game />
          {
            /*TODO remove */

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <input type="text" ref={commandInput} />
              <button
                disabled={
                  getPlatformKind() === PlatformKind.desktop &&
                  !desktopEngineProcess
                }
                onClick={() => {
                  const newCommand = commandInput.current?.value;
                  if (newCommand === null) return;
                  sendCommandToInstalledEngine(newCommand!);
                  commandInput.current!.value = "";
                }}
              >
                Send command
              </button>
            </div>
          }
        </>
      )}
    </main>
  );
}

export default App;
