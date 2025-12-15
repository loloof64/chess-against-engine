import { Chessboard } from "react-chessboard";
import "./BoardEditor.css";
import ValueSelector, { PieceColor, PieceType } from "./ValueSelector";
import { useState } from "react";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

function BoardEditor() {
  const [pieceType, setPieceType] = useState(PieceType.none);
  const [pieceColor, setPieceColor] = useState(PieceColor.white);

  const { currentPosition } = usePositionEditor();
  const dispatch = usePositionEditorDispatch();

  function convertColorFrom(pieceColor: PieceColor): Color {
    return pieceColor == PieceColor.white ? "w" : "b";
  }

  function convertTypeFrom(pieceType: PieceType): PieceSymbol {
    switch (pieceType) {
      case PieceType.pawn:
        return "p";
      case PieceType.knight:
        return "n";
      case PieceType.bishop:
        return "b";
      case PieceType.rook:
        return "r";
      case PieceType.queen:
        return "q";
      case PieceType.king:
        return "k";
      default:
        throw `Unrecognized piece ${pieceType}.`;
    }
  }

  function setPieceAt(square: string) {
    const gameLogic = new Chess(currentPosition, { skipValidation: true });
    const logicSquare: Square = square as Square;
    if (pieceType === PieceType.none) {
      gameLogic.remove(logicSquare);
    } else {
      const newColor = convertColorFrom(pieceColor);
      const newType = convertTypeFrom(pieceType);
      gameLogic.put({ type: newType, color: newColor }, logicSquare);
    }
    dispatch({
      type: PositionEditorActionType.changeCurrentPosition,
      value: gameLogic.fen(),
    });
  }

  return (
    <div className="posEditor">
      <div className="container1">
        <div className="board">
          <Chessboard
            options={{
              position: currentPosition,
              allowDragging: false,
              showNotation: false,
              onSquareClick: ({ square }) => setPieceAt(square),
            }}
          />
        </div>
        <div className="options">
          <ValueSelector
            selectedPieceType={pieceType}
            selectedPieceColor={pieceColor}
            onPieceColorSelected={setPieceColor}
            onPieceTypeSelected={setPieceType}
          />
        </div>
      </div>
    </div>
  );
}

export default BoardEditor;
