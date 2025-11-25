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

  function addMove(moveSan: string, isWhiteMove: boolean) {
    const moveCaption = convertSanToFan(moveSan, isWhiteMove);
    const newMove = {
      fan: moveCaption,
      fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
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
