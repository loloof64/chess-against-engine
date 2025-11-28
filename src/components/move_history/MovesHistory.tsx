import "./MovesHistory.css";
import MoveHistoryNode, { MoveHistoryNodeProps } from "./MoveHistoryNode";
import { Fragment } from "react/jsx-runtime";

interface MovesHistoryProps {
  moves: Array<MoveHistoryNodeProps>;
}

function MovesHistory({ moves }: MovesHistoryProps) {
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
