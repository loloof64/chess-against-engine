import "./MoveHistoryNode.css";

export interface MoveHistoryNodeProps {
  fan: string; // figurine algebraic notation
  fen: string; // Forsyth-Edwards notation
  clickCallback: (fen: string) => void;
}

function MoveHistoryNode({ fan, fen, clickCallback }: MoveHistoryNodeProps) {
  return <button onClick={() => clickCallback(fen)}>{fan}</button>;
}

export default MoveHistoryNode;
