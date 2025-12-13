import "./Toolbar.css";
import {
  EMPTY_POSITION,
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";

import StartGameImg from "./icons/start.svg";
import StopGameImg from "./icons/stop.svg";
import ReverseBoardImg from "./icons/reverse.svg";
import { useState } from "react";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { t } from "i18next";
import MessageDialog from "../dialogs/MessageDialog";
import CustomPositionDialog from "../dialogs/CustomPositionDialog";

function Toolbar() {
  const { positionFen } = useGame();
  const dispatch = useGameDispatch();
  const [isConfirmNewGameDialogOpen, setIsConfirmNewGameDialogOpen] =
    useState(false);
  const [confirmNewGameDialogMessage, setConfirmNewGameDialogMessage] =
    useState("");
  const [isConfirmStopGameDialogOpen, setIsConfirmStopGameDialogOpen] =
    useState(false);
  const [confirmStopGameDialogMessage, setConfirmStopGameDialogMessage] =
    useState("");
  const [isGameStoppedDialogOpen, setIsGameStoppedDialogOpen] = useState(false);
  const [gameStoppedDialogMessage, setGameStoppedDialogMessage] = useState("");

  const [isCustomPositionDialogOpen, setIsCustomPositionDialogOpen] =
    useState(false);

  function handleNewGameConfirmationDialogStatusChange(newState: boolean) {
    setIsConfirmNewGameDialogOpen(newState);
  }

  function handleNewGameConfirmDialogValidated() {
    setIsConfirmNewGameDialogOpen(false);
    setIsCustomPositionDialogOpen(true);
  }

  function handleNewGameConfirmDialogCancelled() {
    setIsConfirmNewGameDialogOpen(false);
  }

  function handleStopGameConfirmationDialogStatusChange(newState: boolean) {
    setIsConfirmStopGameDialogOpen(newState);
  }

  function handleStopGameConfirmDialogValidated() {
    setIsConfirmStopGameDialogOpen(false);
    dispatch({
      type: GameActionType.stopGame,
    });

    setGameStoppedDialogMessage(t("toolbar.gameStopped"));
    setIsGameStoppedDialogOpen(true);
  }

  function handleStopGameConfirmDialogCancelled() {
    setIsConfirmStopGameDialogOpen(false);
  }

  function handleGameStoppedDialogStatusChange(newState: boolean) {
    setIsGameStoppedDialogOpen(newState);
  }

  function handleCustomPositionDialogStatusChange(newState: boolean) {
    setIsCustomPositionDialogOpen(newState);
  }

  function handleCustomPositionDialogValidated() {
    setIsCustomPositionDialogOpen(false);
    dispatch({
      type: GameActionType.startNewDefaultGame,
    });
  }

  function handleCustomPositionDialogCancelled() {
    setIsCustomPositionDialogOpen(false);
  }

  function startNewDefaultGame() {
    const noGameStarted = positionFen === EMPTY_POSITION;
    if (noGameStarted) {
      setIsCustomPositionDialogOpen(true);
    } else {
      setConfirmNewGameDialogMessage(t("toolbar.confirmNewGame.message"));
      setIsConfirmNewGameDialogOpen(true);
    }
  }

  function stopGame() {
    const atLeastAGameStarted = positionFen !== EMPTY_POSITION;
    if (atLeastAGameStarted) {
      setConfirmStopGameDialogMessage(t("toolbar.confirmStopGame.message"));
      setIsConfirmStopGameDialogOpen(true);
    }
  }

  function reverseBoard() {
    dispatch({
      type: GameActionType.reverseBoard,
    });
  }

  return (
    <div className="toolbar">
      <button onClick={startNewDefaultGame}>
        <img src={StartGameImg}></img>
      </button>
      <button onClick={stopGame}>
        <img src={StopGameImg}></img>
      </button>
      <button onClick={reverseBoard}>
        <img src={ReverseBoardImg}></img>
      </button>
      <ConfirmationDialog
        isOpen={isConfirmNewGameDialogOpen}
        message={confirmNewGameDialogMessage}
        onConfirmCb={handleNewGameConfirmDialogValidated}
        onCancelCb={handleNewGameConfirmDialogCancelled}
        onOpenChange={handleNewGameConfirmationDialogStatusChange}
      />
      <ConfirmationDialog
        isOpen={isConfirmStopGameDialogOpen}
        message={confirmStopGameDialogMessage}
        onConfirmCb={handleStopGameConfirmDialogValidated}
        onCancelCb={handleStopGameConfirmDialogCancelled}
        onOpenChange={handleStopGameConfirmationDialogStatusChange}
      />
      <MessageDialog
        isOpen={isGameStoppedDialogOpen}
        message={gameStoppedDialogMessage}
        onOpenChange={handleGameStoppedDialogStatusChange}
      />
      <CustomPositionDialog
        isOpen={isCustomPositionDialogOpen}
        onOpenChange={handleCustomPositionDialogStatusChange}
        onConfirmCb={handleCustomPositionDialogValidated}
        onCancelCb={handleCustomPositionDialogCancelled}
      />
    </div>
  );
}

export default Toolbar;
