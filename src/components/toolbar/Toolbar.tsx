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
      value: "r7/1P6/8/7K/k7/8/8/1Q6 w - - 0 1",
    });
  }

  function stopGame() {
    ////////////
    console.log("game stopped");
    /////////////
    dispatch({
      type: GameActionType.stopGame,
    });
  }

  return (
    <div className="toolbar">
      <ul>
        <li onClick={startNewDefaultGame}>New game</li>
        <li onClick={startNewCustomGame}>New custom game</li>
        <li onClick={stopGame}>Stop game</li>
      </ul>
    </div>
  );
}

export default Toolbar;
