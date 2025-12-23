import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import useWindowOrientation from "../../utils/useWindowOrientation";
import InlineMovesHistory from "../move_history/InlineMovesHistory";

function Game() {
  const { orientation } = useWindowOrientation();
  return orientation === "landscape" ? (
    <div className="game">
      <div className="board">
        <Board />
      </div>
      <MovesHistory />
    </div>
  ) : (
    <div className="game portrait">
      <div className="board">
        <Board />
      </div>
      <InlineMovesHistory />
    </div>
  );
}

export default Game;
