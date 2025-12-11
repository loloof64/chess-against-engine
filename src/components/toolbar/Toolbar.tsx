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
      <button onClick={startNewDefaultGame}>New game</button>
      <button onClick={startNewCustomGame}>New custom game</button>
      <button onClick={stopGame}>Stop game</button>
      <button onClick={reverseBoard}>Reverse board</button>
    </div>
  );
}

export default Toolbar;
