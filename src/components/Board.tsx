import {
  ChessGame,
  useChessGameContext,
} from "@react-chess-tools/react-chess-game";
import { PieceDropHandlerArgs } from "react-chessboard";
import convertSanToFan from "../core/sanConversion";
import { Chess } from "chess.js";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../stores/game/GameContext";

function Board() {
  const { historyMoves } = useGame();
  const dispatch = useGameDispatch();
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

    dispatch({
      type: GameActionType.appendHistoryMove,
      value: newMove,
    });
  }

  function handlePieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) {
    const chessLogic = new Chess(gameCtx.currentFen);
    const move = chessLogic.move({
      from: sourceSquare,
      to: targetSquare ?? sourceSquare,
    });
    if (move) {
      const isWhiteTurnBeforeMove = gameCtx.info.turn == "w";
      const moveNumber = parseInt(gameCtx.currentFen.split(" ")[5]);
      const weShouldAddMoveNumber =
        isWhiteTurnBeforeMove || historyMoves.length === 0;
      if (weShouldAddMoveNumber) {
        addMove(
          `${moveNumber}.${isWhiteTurnBeforeMove ? "" : ".."}`,
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
  }

  return (
    <>
      <ChessGame.Board
        options={{
          onPieceDrop: handlePieceDrop,
        }}
      />
      <ChessGame.Sounds />
    </>
  );
}

export default Board;
