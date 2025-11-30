import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

import Board from "../Board";
import { useState } from "react";
import { ChessGame } from "@react-chess-tools/react-chess-game";
import { MoveHistoryNodeProps } from "../move_history/MoveHistoryNode";
import { useGame } from "../../stores/game/GameContext";

function Game() {
  const { positionFen, boardOrientation, boardKey } = useGame();
  const [moves, setMoves] = useState<Array<MoveHistoryNodeProps>>([]);

  function appendMove(newMove: MoveHistoryNodeProps) {
    setMoves((oldMoves) => [...oldMoves, newMove]);
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
      <MovesHistory moves={moves} />
    </div>
  );
}

export default Game;
