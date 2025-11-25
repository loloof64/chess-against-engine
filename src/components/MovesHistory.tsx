import "./MovesHistory.css";
import MoveHistoryNode, { MoveHistoryNodeProps } from "./MoveHistoryNode";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useUpdateEffect } from "ahooks";

const sanConversions = {
  white: {
    N: "♘",
    B: "♗",
    R: "♖",
    Q: "♕",
    K: "♔",
  },
  black: {
    N: "♞",
    B: "♝",
    R: "♜",
    Q: "♛",
    K: "♚",
  },
};

const pieceRegex = /[NBRQK]/;

function convertSanToFan(san: string, isWhiteMove: boolean) {
  const colorIndex = isWhiteMove ? "white" : "black";
  return san.replace(pieceRegex, (match) => {
    const innerMap = sanConversions[colorIndex];
    return innerMap[match as keyof typeof innerMap];
  });
}

function MovesHistory() {
  const [moves, setMoves] = useState<Array<MoveHistoryNodeProps>>([]);

  function addMove(
    moveSan: string,
    isWhiteMove: boolean,
    fenAfterMove: string
  ) {
    const moveCaption = convertSanToFan(moveSan, isWhiteMove);
    const newMove = {
      fan: moveCaption,
      fen: fenAfterMove,
      clickCallback: (fen: string) => console.log(`Got fen ${fen}.`),
    };

    setMoves((oldMoves) => [...oldMoves, newMove]);
  }

  return (
    <div className="history">
      {moves.map((nodeDef, index) => (
        <Fragment key={index}>
          {
            <MoveHistoryNode
              fan={nodeDef.fan}
              fen={nodeDef.fen}
              clickCallback={nodeDef.clickCallback}
            />
          }
        </Fragment>
      ))}
    </div>
  );
}

export default MovesHistory;
