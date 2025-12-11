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

function MovesHistory({ moves }: MovesHistoryProps) {
  const { historyIndex } = useGame();
  const dispatch = useGameDispatch();

  function gotoFirstPosition() {
    dispatch({
      type: GameActionType.gotoPositionIndex,
      value: -1,
    });
  }

  function gotoPreviousMove() {
    const previousIndex = findPreviousIndex();
    dispatch({
      type: GameActionType.gotoPositionIndex,
      value: previousIndex,
    });
  }

  function gotoNextMove() {
    const nextIndex = findNextIndex();
    dispatch({
      type: GameActionType.gotoPositionIndex,
      value: nextIndex,
    });
  }

  function gotoLastPosition() {
    dispatch({
      type: GameActionType.gotoPositionIndex,
      value: moves.length - 1,
    });
  }

  function findPreviousIndex(): number {
    let previousIndex = historyIndex ?? -1;
    if (previousIndex <= -1) return -1;
    do {
      previousIndex--;
      if (previousIndex < 0) break;
      const currentNode = moves[previousIndex];
      const isMoveNode = currentNode.fen !== "";
      if (isMoveNode) break;
    } while (true);
    return previousIndex;
  }

  function findNextIndex(): number {
    let nextIndex = historyIndex ?? -1;
    if (nextIndex >= moves.length - 1) return moves.length - 1;
    if (nextIndex < -1) nextIndex = -1;
    do {
      nextIndex++;
      const currentNode = moves[nextIndex];
      const isMoveNode = currentNode.fen !== "";
      if (isMoveNode) break;
    } while (true);
    return nextIndex;
  }

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
