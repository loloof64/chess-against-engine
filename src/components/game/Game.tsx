import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../board/Board";
import { ChessGame } from "@react-chess-tools/react-chess-game";
import { useGame } from "../../stores/game/GameContext";

function Game() {
  const { boardKey, positionFen, boardOrientation, historyMoves, inProgress } =
    useGame();

  return (
    <div className="game">
      <div className={`board-wrapper ${inProgress ? "" : "locked"}`}>
        <div className="board">
          <ChessGame.Root
            key={boardKey}
            fen={positionFen}
            orientation={boardOrientation}
          >
            <Board />
          </ChessGame.Root>
        </div>
      </div>
      <MovesHistory moves={historyMoves} />
    </div>
  );
}

export default Game;
