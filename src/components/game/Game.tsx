import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../Board";
import { ChessGame } from "@react-chess-tools/react-chess-game";
import { MoveHistoryNodeProps } from "../move_history/MoveHistoryNode";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";

function Game() {
  const { boardKey, positionFen, boardOrientation, historyMoves } = useGame();
  const dispatch = useGameDispatch();
  function appendMove(newMove: MoveHistoryNodeProps) {
    dispatch({
      type: GameActionType.appendHistoryMove,
      value: newMove,
    });
  }

  return (
    <div className="game">
      <div className="board">
        <ChessGame.Root
          key={boardKey}
          fen={positionFen}
          orientation={boardOrientation}
        >
          <Board appendMove={appendMove} />
        </ChessGame.Root>
      </div>
      <MovesHistory moves={historyMoves} />
    </div>
  );
}

export default Game;
