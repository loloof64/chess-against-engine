import "./Board.css";

import {
  PieceDropHandlerArgs,
  Chessboard,
  PieceHandlerArgs,
} from "react-chessboard";
import convertSanToFan from "../../core/sanConversion";
import { Chess, Move } from "chess.js";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import PromotionDialog from "./PromotionDialog";
import { useState } from "react";
import MessageDialog from "./MessageDialog";

function Board() {
  const { historyMoves, positionFen, inProgress, boardKey } = useGame();
  const dispatch = useGameDispatch();

  const isWhiteTurn = positionFen.split(" ")[1] !== "b";
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<
    Move | undefined
  >();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageDialogCaption, setMessageDialogCaption] = useState("");

  function showGameOverNotification() {
    const gameLogic = new Chess(positionFen);
    let message: string;
    if (gameLogic.isCheckmate()) {
      const whiteWon = gameLogic.turn() !== "w";
      const winnerLabel = whiteWon ? "White" : "Black";
      message = `${winnerLabel} has won by checkmate.`;
    } else if (gameLogic.isStalemate()) {
      message = `Draw by stalemate.`;
    } else if (gameLogic.isInsufficientMaterial()) {
      message = `Draw by insufficient material.`;
    } else if (gameLogic.isThreefoldRepetition()) {
      message = `Draw by three-fold repetition`;
    } else {
      message = `Draw by the fifty moves rule.`;
    }
    setMessageDialogCaption(message);
    setIsMessageDialogOpen(true);
  }

  function checkGameOverAndEventualyNotify() {
    const gameLogic = new Chess(positionFen);
    const isGameOver = gameLogic.isGameOver();
    if (isGameOver) {
      dispatch({
        type: GameActionType.stopGame,
      });
      showGameOverNotification();
    }
  }

  function commitPromotion(piece: string) {
    setIsPromotionDialogOpen(false);
    const turn = positionFen.split(" ")[1];
    const isWhiteTurnBeforeMove = turn == "w";
    const chessLogic = new Chess(positionFen);
    const moveToCommit = {
      from: pendingPromotionMove?.from ?? "a1",
      to: pendingPromotionMove?.to ?? "a1",
      promotion: piece,
    };
    const moveToCommitResult = chessLogic.move(moveToCommit);
    dispatch({
      type: GameActionType.makeMove,
      value: moveToCommit,
    });
    addHistoryMove(
      moveToCommitResult.san,
      isWhiteTurnBeforeMove,
      moveToCommitResult.after,
      (fen) => console.log(fen)
    );
    checkGameOverAndEventualyNotify();
  }

  function handlePromotionDialogStatusChange(newState: boolean) {
    setIsPromotionDialogOpen(newState);
  }

  function handleMessageDialogStatusChange(newState: boolean) {
    setIsMessageDialogOpen(newState);
  }

  function addHistoryMove(
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

  function handleCanDragPiece({ piece }: PieceHandlerArgs): boolean {
    if (!inProgress) return false;
    const pieceType = piece.pieceType[0];
    if (pieceType.length === 0) return false;
    const playerTurn = new Chess(positionFen).turn();
    return playerTurn === pieceType;
  }

  function handlePieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) {
    const chessLogic = new Chess(positionFen);
    const move = chessLogic.move({
      from: sourceSquare,
      to: targetSquare ?? sourceSquare,
      promotion: "q",
    });
    if (move) {
      const turn = positionFen.split(" ")[1];
      const isWhiteTurnBeforeMove = turn == "w";
      const isPromotionMove = move.isPromotion();
      const moveNumber = parseInt(positionFen.split(" ")[5]);
      const weShouldAddHistoryMoveNumber =
        isWhiteTurnBeforeMove || historyMoves.length === 0;
      if (weShouldAddHistoryMoveNumber) {
        addHistoryMove(
          `${moveNumber}.${isWhiteTurnBeforeMove ? "" : ".."}`,
          isWhiteTurnBeforeMove,
          "",
          () => {}
        );
      }
      if (isPromotionMove) {
        setPendingPromotionMove(move);
        setIsPromotionDialogOpen(true);
      } else {
        dispatch({
          type: GameActionType.makeMove,
          value: move,
        });
        addHistoryMove(move.san, isWhiteTurnBeforeMove, move.after, (fen) =>
          console.log(fen)
        );
        checkGameOverAndEventualyNotify();
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <Chessboard
        key={boardKey}
        options={{
          onPieceDrop: handlePieceDrop,
          canDragPiece: handleCanDragPiece,
          position: positionFen,
        }}
      />

      <PromotionDialog
        whiteTurn={isWhiteTurn}
        isOpen={isPromotionDialogOpen}
        onOpenChange={handlePromotionDialogStatusChange}
        onSelection={commitPromotion}
      />
      <MessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={handleMessageDialogStatusChange}
        message={messageDialogCaption}
      />
    </>
  );
}

export default Board;
