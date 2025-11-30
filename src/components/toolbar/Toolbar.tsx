import "./Toolbar.css";
import { GameActionType, useGameDispatch } from "../../stores/game/GameContext";

function Toolbar() {
  const dispatch = useGameDispatch();

  function startNewDefaultGame() {
    dispatch({
      type: GameActionType.startNewDefaultGame,
    });
  }

  function startNewCustomGame() {
    dispatch({
      type: GameActionType.startNewGame,
      value: "8/8/8/8/8/1k1bb3/8/K7 b - - 0 45",
    });
  }

  return (
    <div className="toolbar">
      <ul>
        <li onClick={startNewDefaultGame}>New game</li>
        <li onClick={startNewCustomGame}>New custom game</li>
      </ul>
    </div>
  );
}

export default Toolbar;
