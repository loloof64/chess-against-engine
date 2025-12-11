import { Arrow } from "react-chessboard";
import "./MoveHistoryNode.css";
import { HistoryUpdateProps } from "../../stores/game/GameContext";

export interface MoveHistoryNodeProps {
  fan: string; // figurine algebraic notation
  fen: string; // Forsyth-Edwards notation
  moveArrow: Arrow;
  clickCallback: ({ newFen, moveArrow }: HistoryUpdateProps) => void;
}

function MoveHistoryNode({
  fan,
  fen,
  moveArrow,
  clickCallback,
}: MoveHistoryNodeProps) {
  return (
    <button onClick={() => clickCallback({ newFen: fen, moveArrow })}>
      {fan}
    </button>
  );
}

export default MoveHistoryNode;
