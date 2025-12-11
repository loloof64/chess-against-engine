import "./MovesHistory.css";
import MoveHistoryNode, { MoveHistoryNodeProps } from "./MoveHistoryNode";
import { Fragment } from "react/jsx-runtime";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";

interface MovesHistoryProps {
  moves: Array<MoveHistoryNodeProps>;
  firstPosition: string;
}

function MovesHistory({ moves, firstPosition }: MovesHistoryProps) {
  const { historyIndex } = useGame();
  const dispatch = useGameDispatch();

  function gotoFirstPosition() {
    dispatch({
      type: GameActionType.gotoPosition,
      value: {
        newFen: firstPosition,
        moveArrow: undefined,
      },
    });
  }

  function gotoPreviousMove() {}

  function gotoNextMove() {}

  function gotoLastPosition() {}

  return (
    <div className="history">
      <div className="history-buttons">
        <button onClick={gotoFirstPosition}>⇤</button>
        <button onClick={gotoPreviousMove}>←</button>
        <button onClick={gotoNextMove}>→</button>
        <button onClick={gotoLastPosition}>⇥</button>
      </div>
      <div className="history-moves">
        {moves.map((nodeDef, index) => (
          <Fragment key={index}>
            {
              <MoveHistoryNode
                fan={nodeDef.fan}
                fen={nodeDef.fen}
                moveArrow={nodeDef.moveArrow}
                historyIndex={index}
                clickCallback={nodeDef.clickCallback}
                className={index === historyIndex ? "move selected" : "move"}
              />
            }
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default MovesHistory;
