import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import { useGame } from "../../stores/game/GameContext";

function Game() {
  const { historyMoves, firstPosition } = useGame();

  return (
    <div className="game">
      <div className="board">
        <Board />
      </div>
      <MovesHistory moves={historyMoves} firstPosition={firstPosition} />
    </div>
  );
}

export default Game;
