import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import { useGame } from "../../stores/game/GameContext";

function Game() {
  const { historyMoves } = useGame();

  return (
    <div className="game">
      <div className="board">
        <Board />
      </div>
      <MovesHistory moves={historyMoves} />
    </div>
  );
}

export default Game;
