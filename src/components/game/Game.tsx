import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import InlineMovesHistory from "../move_history/InlineMovesHistory";
import getPlatformKind, { PlatformKind } from "../../utils/PlatformKind";
import useWindowOrientation from "../../hooks/useWindowOrientation";
import { useRef } from "react";
import { useEngineProcess } from "../../stores/game/AndroidEngineProcessContext";

function Game() {
  const { orientation } = useWindowOrientation();
  const { sendCommandToEngine } = useEngineProcess();
  /* TODO remove after tests done */
  const commandInput = useRef<HTMLInputElement | null>(null);

  return orientation === "landscape" ? (
    <div
      className={`game ${
        getPlatformKind() === PlatformKind.android ? "android" : ""
      }`}
    >
      <div className="board">
        <Board />
      </div>
      <MovesHistory />
      {
        /* TODO remove after tests done */
        getPlatformKind() === PlatformKind.android && (
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
                sendCommandToEngine(newCommand! + "\n");
                commandInput.current!.value = "";
              }}
            >
              Send to engine
            </button>
          </div>
        )
      }
    </div>
  ) : (
    <div className="game">
      <InlineMovesHistory />
      <div className="board">
        <Board />
      </div>
      {
        /* TODO remove after tests done */
        getPlatformKind() === PlatformKind.android && (
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
              Send to engine
            </button>
          </div>
        )
      }
    </div>
  );
}

export default Game;
