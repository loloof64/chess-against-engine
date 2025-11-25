import "./MovesHistory.css";
import MoveHistoryNode, { MoveHistoryNodeProps } from "./MoveHistoryNode";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useInterval } from "ahooks";

function MovesHistory() {
  const [moves, setMoves] = useState<Array<MoveHistoryNodeProps>>([]);

  function addSampleMove() {
    const newMove = {
      fan: "♝f6",
      fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
      clickCallback: (fen: string) => console.log(`Got fen ${fen}.`),
    };

    setMoves((oldMoves) => [...oldMoves, newMove]);
  }

  useInterval(() => addSampleMove(), 50);

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
