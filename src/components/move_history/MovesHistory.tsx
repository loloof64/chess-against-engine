import "./MovesHistory.css";
import { Fragment } from "react/jsx-runtime";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";
import { t } from "i18next";

import First from "./vectors/first.svg";
import Back from "./vectors/back.svg";
import Next from "./vectors/next.svg";
import Last from "./vectors/last.svg";
import MoveHistoryNode from "./MoveHistoryNode";
import { useEffect, useRef } from "react";

function MovesHistory() {
  const { historyIndex, historyMoves } = useGame();
  const dispatch = useGameDispatch();
  const historyRef = useRef<HTMLDivElement | null>(null);

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
      const lastNodePositionY =
        lastChildRect.top - parentRect.top + historyRef.current.scrollTop;
      historyRef.current.scrollTo({
        left: lastNodePositionX,
        top: lastNodePositionY,
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
      value: historyMoves.length - 1,
    });
  }

  function findPreviousIndex(): number {
    let previousIndex = historyIndex ?? -1;
    if (previousIndex <= -1) return -1;
    do {
      previousIndex--;
      if (previousIndex < 0) break;
      const currentNode = historyMoves[previousIndex];
      const isMoveNode = currentNode.fen !== "";
      if (isMoveNode) break;
    } while (true);
    return previousIndex;
  }

  function findNextIndex(): number {
    let nextIndex = historyIndex ?? -1;
    if (nextIndex >= historyMoves.length - 1) return historyMoves.length - 1;
    if (nextIndex < -1) nextIndex = -1;
    do {
      nextIndex++;
      const currentNode = historyMoves[nextIndex];
      const isMoveNode = currentNode.fen !== "";
      if (isMoveNode) break;
    } while (true);
    return nextIndex;
  }

  return (
    <div className="history">
      <div className="history-buttons">
        <button onClick={gotoFirstPosition}>
          <img src={First} alt={t("history.buttonsAltLabels.first")} />
        </button>
        <button onClick={gotoPreviousMove}>
          <img src={Back} alt={t("history.buttonsAltLabels.previous")} />
        </button>
        <button onClick={gotoNextMove}>
          <img src={Next} alt={t("history.buttonsAltLabels.next")} />
        </button>
        <button onClick={gotoLastPosition}>
          <img src={Last} alt={t("history.buttonsAltLabels.last")} />
        </button>
      </div>
      <div className="history-moves" ref={historyRef}>
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
    </div>
  );
}

export default MovesHistory;
