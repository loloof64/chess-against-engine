import { Chessboard } from "react-chessboard";
import "./ChessPositionEditor.css";
import ValueSelector from "./ValueSelector";

function ChessPositionEditor() {
  return (
    <div className="posEditor">
      <div className="board">
        <Chessboard
          options={{
            allowDragging: false,
          }}
        />
      </div>
      <ValueSelector />
    </div>
  );
}

export default ChessPositionEditor;
