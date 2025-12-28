import { useEffect, useRef, useState } from "react";
import "./App.css";
import { AndroidEngineSelector } from "./components/AndroidEngineSelector";
import Game from "./components/game/Game";
import Toolbar from "./components/toolbar/Toolbar";
import { useAndroidEngineProcess } from "./hooks/engine/AndroidEngineProcessContext";

import getPlatformKind, { PlatformKind } from "./utils/PlatformKind";
import { useDesktopEngineProcess } from "./hooks/engine/DesktopEngineProcessContext";

function App() {
  const { engineProcess: androidEngineProcess } = useAndroidEngineProcess();
  const [showEngineSelector, setShowEngineSelector] = useState(false);
  const { sendCommandToEngine } = useDesktopEngineProcess();
  /* TODO remove */
  const commandInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setShowEngineSelector(
      () =>
        getPlatformKind() === PlatformKind.android &&
        androidEngineProcess === null
    );
  }, [androidEngineProcess]);

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
                onClick={() => {
                  const newCommand = commandInput.current?.value;
                  if (newCommand === null) return;
                  sendCommandToEngine(newCommand!);
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
