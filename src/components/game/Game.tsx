import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import InlineMovesHistory from "../move_history/InlineMovesHistory";
import getPlatformKind, { PlatformKind } from "../../utils/PlatformKind";
import useWindowOrientation from "../../hooks/useWindowOrientation";
import Clock from "../clock/Clock";

function Game() {
  const { orientation } = useWindowOrientation();
  const isTimed = true;

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
      {isTimed && <Clock />}
    </div>
  ) : (
    <div className="game">
      <InlineMovesHistory />
      <div className="board">
        <Board />
      </div>
      {isTimed && <Clock />}
    </div>
  );
}

export default Game;
