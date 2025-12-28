import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";

import { attachConsole } from "@tauri-apps/plugin-log";
import GameProvider from "./stores/game/GameContext";
import PositionEditorProvider from "./stores/game/PositionEditorContext";
import { AndroidEngineProcessProvider } from "./hooks/engine/AndroidEngineProcessContext";
import { DesktopEngineProcessProvider } from "./hooks/engine/DesktopEngineProcessContext";

await attachConsole();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GameProvider>
      <PositionEditorProvider>
        <AndroidEngineProcessProvider>
          <DesktopEngineProcessProvider>
            <App />
          </DesktopEngineProcessProvider>
        </AndroidEngineProcessProvider>
      </PositionEditorProvider>
    </GameProvider>
  </React.StrictMode>
);
