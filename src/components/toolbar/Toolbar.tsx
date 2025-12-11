import "./Toolbar.css";
import { GameActionType, useGameDispatch } from "../../stores/game/GameContext";

import StartGameImg from "./icons/start.svg";
import StopGameImg from "./icons/stop.svg";
import ReverseBoardImg from "./icons/reverse.svg";

function Toolbar() {
  const dispatch = useGameDispatch();

  function startNewDefaultGame() {
    dispatch({
      type: GameActionType.startNewDefaultGame,
    });
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
    </div>
  );
}

export default Toolbar;
