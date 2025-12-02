import "./Board.css";

import {
  ChessGame,
  useChessGameContext,
} from "@react-chess-tools/react-chess-game";
import { PieceDropHandlerArgs } from "react-chessboard";
import convertSanToFan from "../../core/sanConversion";
import { Chess, Move } from "chess.js";
import {
  EMPTY_POSITION,
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import PromotionDialog from "./PromotionDialog";
import { useState, useEffect } from "react";
import MessageDialog from "./MessageDialog";

function Board() {
  const { historyMoves } = useGame();
  const dispatch = useGameDispatch();
  const gameCtx = useChessGameContext();

  const isWhiteTurn = gameCtx.currentFen.split(" ")[1] !== "b";
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<
    Move | undefined
  >();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageDialogCaption, setMessageDialogCaption] = useState("");

  useEffect(() => {
    const isNotEmptyPosition = gameCtx.currentFen !== EMPTY_POSITION;
    if (isNotEmptyPosition) checkGameOverAndEventualyNotify();
  }, [gameCtx.currentFen, gameCtx.info.isGameOver]);

  function showGameOverNotification() {
    let message: string;
    if (gameCtx.info.isCheckmate) {
      const whiteWon = gameCtx.info.turn !== "w";
      const winnerLabel = whiteWon ? "White" : "Black";
      message = `${winnerLabel} has won by checkmate.`;
    } else if (gameCtx.info.isStalemate) {
      message = `Draw by stalemate.`;
    } else if (gameCtx.info.isInsufficientMaterial) {
      message = `Draw by insufficient material.`;
    } else if (gameCtx.info.isThreefoldRepetition) {
      message = `Draw by three-fold repetition`;
    } else {
      message = `Draw by the fifty moves rule.`;
    }
    setMessageDialogCaption(message);
    setIsMessageDialogOpen(true);
  }

  function checkGameOverAndEventualyNotify() {
    const isGameOver = gameCtx.info.isGameOver;
    if (isGameOver) {
      dispatch({
        type: GameActionType.stopGame,
      });
      showGameOverNotification();
    }
  }

  function commitPromotion(piece: string) {
    setIsPromotionDialogOpen(false);
    const isWhiteTurnBeforeMove = gameCtx.info.turn == "w";
    const chessLogic = new Chess(gameCtx.currentFen);
    const moveToCommit = chessLogic.move({
      from: pendingPromotionMove?.from ?? "a1",
      to: pendingPromotionMove?.to ?? "a1",
      promotion: piece,
    });
    gameCtx.methods.makeMove(moveToCommit);
    addHistoryMove(
      moveToCommit.san,
      isWhiteTurnBeforeMove,
      moveToCommit.after,
      (fen) => console.log(fen)
    );
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

  function handlePieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) {
    const chessLogic = new Chess(gameCtx.currentFen);
    const move = chessLogic.move({
      from: sourceSquare,
      to: targetSquare ?? sourceSquare,
      promotion: "q",
    });
    if (move) {
      const isWhiteTurnBeforeMove = gameCtx.info.turn == "w";
      const isPromotionMove = move.isPromotion();
      const moveNumber = parseInt(gameCtx.currentFen.split(" ")[5]);
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
        gameCtx.methods.makeMove(move);
        addHistoryMove(move.san, isWhiteTurnBeforeMove, move.after, (fen) =>
          console.log(fen)
        );
        return true;
      }
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
