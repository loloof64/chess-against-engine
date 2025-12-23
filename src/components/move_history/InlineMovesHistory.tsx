import { Fragment } from "react/jsx-runtime";
import "./InlineMovesHistory.css";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import MoveHistoryNode from "./MoveHistoryNode";

function InlineMovesHistory() {
  const { historyIndex, firstPosition, historyMoves } = useGame();
  const dispatch = useGameDispatch();

  function handleStartPositionClicked() {
    dispatch({
      type: GameActionType.gotoPositionIndex,
      value: -1,
    });
    dispatch({
      type: GameActionType.setHistoryIndex,
      value: -1,
    });
  }

  return (
    <div className="inline-history-moves">
      <MoveHistoryNode
        fan="|>"
        fen={firstPosition}
        moveArrow={undefined}
        className=""
        historyIndex={-1}
        clickCallback={handleStartPositionClicked}
      />
      {historyMoves.map((nodeDef, index) => (
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
  );
}

export default InlineMovesHistory;
