import { Fragment } from "react/jsx-runtime";
import "./InlineMovesHistory.css";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import MoveHistoryNode from "./MoveHistoryNode";
import { useEffect, useRef } from "react";

function InlineMovesHistory() {
  const { historyIndex, firstPosition, historyMoves } = useGame();
  const dispatch = useGameDispatch();
  const historyRef = useRef<HTMLDivElement | null>(null);

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

  function scrollToStart() {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        left: 0,
        top: 0,
        behavior: "instant",
      });
    }
  }

  function scrollToLastElement() {
    if (historyRef.current && historyRef.current.lastElementChild) {
      const parentRect = historyRef.current.getBoundingClientRect();
      const lastChildRect =
        historyRef.current.lastElementChild.getBoundingClientRect();
      const lastNodePositionX =
        lastChildRect.left - parentRect.left + historyRef.current.scrollLeft;
      historyRef.current.scrollTo({
        left: lastNodePositionX,
        behavior: "smooth",
      });
    }
  }

  function scrollToSelectedElement() {
    if (historyRef.current) {
      const parentRect = historyRef.current.getBoundingClientRect();
      const selectedChild = Array.from(historyRef.current.children).find(
        (child) => child.classList.contains("selected")
      );
      const selectedChildRect = selectedChild?.getBoundingClientRect();
      if (selectedChildRect) {
        const selectedNodePositionX =
          selectedChildRect.left -
          parentRect.left +
          historyRef.current.scrollLeft;
        const selectedNodePositionY =
          selectedChildRect.top - parentRect.top + historyRef.current.scrollTop;
        historyRef.current.scrollTo({
          left: selectedNodePositionX,
          top: selectedNodePositionY,
          behavior: "instant",
        });
      }
    }
  }

  useEffect(() => {
    scrollToLastElement();
  }, [historyMoves]);

  useEffect(() => {
    if ((historyIndex ?? -1) >= 0) scrollToSelectedElement();
    else scrollToStart();
  }, [historyIndex]);

  return (
    <div className="inline-history-moves" ref={historyRef}>
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
