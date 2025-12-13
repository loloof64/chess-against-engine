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
import ConfirmationDialog from "../board/ConfirmationDialog";
import { t } from "i18next";

function Toolbar() {
  const { positionFen } = useGame();
  const dispatch = useGameDispatch();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");

  function handleConfirmationDialogStatusChange() {}

  function handleConfirmDialogValidated() {
    setIsConfirmDialogOpen(false);
    dispatch({
      type: GameActionType.startNewDefaultGame,
    });
  }

  function handleConfirmDialogCancelled() {
    setIsConfirmDialogOpen(false);
  }

  function startNewDefaultGame() {
    const noGameStarted = positionFen === EMPTY_POSITION;
    if (noGameStarted) {
      dispatch({
        type: GameActionType.startNewDefaultGame,
      });
    } else {
      setConfirmDialogMessage(t("toolbar.confirmNewGame.message"));
      setIsConfirmDialogOpen(true);
    }
  }

  function stopGame() {
    dispatch({
      type: GameActionType.stopGame,
    });
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
        isOpen={isConfirmDialogOpen}
        message={confirmDialogMessage}
        onConfirmCb={handleConfirmDialogValidated}
        onCancelCb={handleConfirmDialogCancelled}
        onOpenChange={handleConfirmationDialogStatusChange}
      />
    </div>
  );
}

export default Toolbar;
