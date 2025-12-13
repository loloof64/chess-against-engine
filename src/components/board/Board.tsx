import "./Board.css";

import {
  PieceDropHandlerArgs,
  Chessboard,
  PieceHandlerArgs,
  Arrow,
} from "react-chessboard";
import convertSanToFan from "../../core/sanConversion";
import { Chess, Move } from "chess.js";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import PromotionDialog from "../dialogs/PromotionDialog";
import { useState } from "react";
import MessageDialog from "../dialogs/MessageDialog";
import { useTranslation } from "react-i18next";

function Board() {
  const {
    historyMoves,
    positionFen,
    inProgress,
    boardKey,
    boardOrientation,
    lastMoveArrow,
  } = useGame();
  const dispatch = useGameDispatch();
  const { t } = useTranslation();

  const isWhiteTurn = positionFen.split(" ")[1] !== "b";
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<
    Move | undefined
  >();
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageDialogCaption, setMessageDialogCaption] = useState("");

  function showGameOverNotification(fenAfterMove: string) {
    const gameLogic = new Chess(fenAfterMove);
    let message: string;
    if (gameLogic.isCheckmate()) {
      const whiteWon = gameLogic.turn() !== "w";
      const winnerLabel = whiteWon
        ? t("board.component.playerSide.white")
        : t("board.component.playerSide.black");
      message = t("board.component.gameEnd.checkmate", { side: winnerLabel });
    } else if (gameLogic.isStalemate()) {
      message = t("board.component.gameEnd.stalemate");
    } else if (gameLogic.isInsufficientMaterial()) {
      message = t("board.component.gameEnd.insufficientMaterial");
    } else if (gameLogic.isThreefoldRepetition()) {
      message = t("board.component.gameEnd.threeFoldRepetition");
    } else {
      message = t("board.component.gameEnd.fiftyMovesRule");
    }
    setMessageDialogCaption(message);
    setIsMessageDialogOpen(true);
  }

  function checkGameOverAndEventualyNotify(fenAfterMove: string) {
    const gameLogic = new Chess(fenAfterMove);
    const isGameOver = gameLogic.isGameOver();
    if (isGameOver) {
      dispatch({
        type: GameActionType.stopGame,
      });
      showGameOverNotification(fenAfterMove);
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
      {
        startSquare: moveToCommit.from,
        endSquare: moveToCommit.to,
        color: "green",
      },
      (historyIndex) => {
        dispatch({
          type: GameActionType.gotoPositionIndex,
          value: historyIndex,
        });
        dispatch({
          type: GameActionType.setHistoryIndex,
          value: historyIndex,
        });
      }
    );
    checkGameOverAndEventualyNotify(moveToCommitResult.after);
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
    moveArrow: Arrow,
    clickCallback: (historyIndex: number) => void
  ) {
    const moveCaption = convertSanToFan(moveSan, isWhiteMove);
    const newMove = {
      fan: moveCaption,
      fen: fenAfterMove,
      moveArrow,
      clickCallback,
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
  }: PieceDropHandlerArgs): boolean {
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
          {
            startSquare: move.from,
            endSquare: move.to,
            color: "green",
          },
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
        addHistoryMove(
          move.san,
          isWhiteTurnBeforeMove,
          move.after,
          {
            startSquare: move.from,
            endSquare: move.to,
            color: "green",
          },
          (historyIndex: number) => {
            dispatch({
              type: GameActionType.gotoPositionIndex,
              value: historyIndex,
            });
            dispatch({
              type: GameActionType.setHistoryIndex,
              value: historyIndex,
            });
          }
        );
        checkGameOverAndEventualyNotify(move.after);
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
          boardOrientation,
          position: positionFen,
          showAnimations: true,
          arrows: lastMoveArrow ? [lastMoveArrow] : [],
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
