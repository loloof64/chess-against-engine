import {
  ChessGame,
  useChessGameContext,
} from "@react-chess-tools/react-chess-game";
import { PieceDropHandlerArgs } from "react-chessboard";
import MovesHistory from "../move_history/MovesHistory";
import { MoveHistoryNodeProps } from "../move_history/MoveHistoryNode";
import convertSanToFan from "../../core/sanConversion";
import "./Game.css";
import { Chess } from "chess.js";
import { useState } from "react";

function Game() {
  const [moves, setMoves] = useState<Array<MoveHistoryNodeProps>>([]);
  const gameCtx = useChessGameContext();

  function addMove(
    moveSan: string,
    isWhiteMove: boolean,
    fenAfterMove: string,
    clickCallback: (fen: string) => void
  ) {
    const moveCaption = convertSanToFan(moveSan, isWhiteMove);
    const newMove = {
      fan: moveCaption,
      fen: fenAfterMove,
      clickCallback: clickCallback,
    };

    setMoves((oldMoves) => [...oldMoves, newMove]);
  }

  return (
    <>
      <div className="board">
        <ChessGame.Board
          options={{
            onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
              const chessLogic = new Chess(gameCtx.currentFen);
              const move = chessLogic.move({
                from: sourceSquare,
                to: targetSquare ?? sourceSquare,
              });
              if (move) {
                const isWhiteTurnBeforeMove = gameCtx.info.turn == "w";
                const moveNumber = Math.floor(gameCtx.info.moveNumber / 2) + 1;
                if (isWhiteTurnBeforeMove) {
                  addMove(
                    `${moveNumber}.`,
                    isWhiteTurnBeforeMove,
                    "",
                    () => {}
                  );
                }
                gameCtx.methods.makeMove(move);
                addMove(move.san, isWhiteTurnBeforeMove, move.after, (fen) =>
                  console.log(fen)
                );
                return true;
              }
              return false;
            },
          }}
        />
      </div>
      <MovesHistory moves={moves} />
    </>
  );
}

export default Game;
