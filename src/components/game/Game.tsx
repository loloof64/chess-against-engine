import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import useWindowOrientation from "../../utils/useWindowOrientation";
import InlineMovesHistory from "../move_history/InlineMovesHistory";
import getPlatformKind, { PlatformKind } from "../../utils/PlatformKind";

function Game() {
  const { orientation } = useWindowOrientation();
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
    </div>
  ) : (
    <div className="game">
      <InlineMovesHistory />
      <div className="board">
        <Board />
      </div>
    </div>
  );
}

export default Game;
