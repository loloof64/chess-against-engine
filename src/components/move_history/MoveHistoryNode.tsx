import { Arrow } from "react-chessboard";
import "./MoveHistoryNode.css";
export interface MoveHistoryNodeProps {
  fan: string; // figurine algebraic notation
  fen: string; // Forsyth-Edwards notation
  moveArrow: Arrow;
  className: string;
  historyIndex: number;
  clickCallback: (historyIndex: number) => void;
}

function MoveHistoryNode({
  fan,
  className,
  historyIndex,
  clickCallback,
}: MoveHistoryNodeProps) {
  return (
    <button onClick={() => clickCallback(historyIndex)} className={className}>
      {fan}
    </button>
  );
}

export default MoveHistoryNode;
