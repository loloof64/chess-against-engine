import "./Toolbar.css";
import { GameActionType, useGameDispatch } from "../../stores/game/GameContext";

function Toolbar() {
  const dispatch = useGameDispatch();
  function startNewDefaultGame() {
    dispatch({
      type: GameActionType.startNewDefaultGame,
    });
  }

  return (
    <div className="toolbar">
      <ul>
        <li onClick={startNewDefaultGame}>New game</li>
      </ul>
    </div>
  );
}

export default Toolbar;
