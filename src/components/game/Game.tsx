import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import { useGame } from "../../stores/game/GameContext";

function Game() {
  const { inProgress, historyMoves } = useGame();

  return (
    <div className="game">
      <div className={`board-wrapper ${inProgress ? "" : "locked"}`}>
        <div className="board">
          <Board />
        </div>
      </div>
      <MovesHistory moves={historyMoves} />
    </div>
  );
}

export default Game;
