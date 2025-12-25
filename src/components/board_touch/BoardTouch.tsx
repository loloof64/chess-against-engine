import { useRef, useState } from "react";
import "./BoardTouch.css";
import MovedPiece from "./MovedPiece";
import { Chess, Piece, Square } from "chess.js";
import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../../stores/game/GameContext";

interface BoardTouchParams {
  currentPositionFen: string;
  onTouch: (file: number, rank: number) => void;
  onMove: (file: number, rank: number) => void;
  onRelease: () => void;
}

interface TouchCoordinates {
  x: number;
  y: number;
}

interface CellCoordinates {
  file: number;
  rank: number;
}

function BoardTouch({ onTouch, onMove, onRelease }: BoardTouchParams) {
  const { positionFen, boardOrientation } = useGame();
  const dispatch = useGameDispatch();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [squareSize, setSquareSize] = useState(0);
  const [pieceX, setPieceX] = useState<number | null>(null);
  const [pieceY, setPieceY] = useState<number | null>(null);
  const [piece, setPiece] = useState<Piece | null>(null);

  function getSquare(file: number, rank: number): Square {
    const fileStr = String.fromCharCode("a".charCodeAt(0) + file);
    const rankStr = String.fromCharCode("1".charCodeAt(0) + rank);
    return `${fileStr}${rankStr}` as Square;
  }

  function getPieceAt(file: number, rank: number): Piece | null {
    try {
      const relatedLogic = new Chess(positionFen);
      const square = getSquare(file, rank);
      return relatedLogic.get(square) ?? null;
    } catch (ex) {
      return null;
    }
  }

  function getCellAt(x: number, y: number): CellCoordinates {
    if (squareSize === 0) return { file: -1, rank: -1 };
    const rawFile = Math.floor(x / squareSize);
    const rawRank = Math.floor(y / squareSize);

    const file = boardOrientation === "white" ? rawFile : 7 - rawFile;
    const rank = boardOrientation === "white" ? 7 - rawRank : rawRank;

    return { file, rank };
  }

  function getTouchCoordinates(
    event: React.TouchEvent<HTMLDivElement>
  ): TouchCoordinates | null {
    if (!overlayRef.current) return null;
    const rect = overlayRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const squareSize = Math.floor(rect.width / 8);
    setSquareSize(squareSize);

    return { x, y };
  }

  function handleTouchDown(event: React.TouchEvent<HTMLDivElement>): void {
    const coordinates = getTouchCoordinates(event);
    if (coordinates === null) return;
    const { x, y } = coordinates;
    const { file, rank } = getCellAt(x, y);
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return;
    const piece = getPieceAt(file, rank);
    if (piece === null) return;
    setPiece(piece);
    setPieceX(x);
    setPieceY(y);
    dispatch({
      type: GameActionType.startDragAndDrop,
      value: getSquare(file, rank),
    });
    onTouch(file, rank);
  }

  function handleTouchUp(): void {
    dispatch({
      type: GameActionType.cancelDragAndDrop,
    });
    onRelease();
    setPiece(null);
    setPieceX(null);
    setPieceY(null);
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    event.preventDefault();
    const coordinates = getTouchCoordinates(event);
    if (coordinates === null) return;
    const { x, y } = coordinates;
    const { file, rank } = getCellAt(x, y);
    onMove(file, rank);
    setPieceX(x);
    setPieceY(y);
  }

  return (
    <>
      <div
        className="boardTouch"
        ref={overlayRef}
        onTouchStart={handleTouchDown}
        onTouchEnd={handleTouchUp}
        onTouchMove={handleTouchMove}
      >
        <MovedPiece
          piece={piece}
          squareSize={squareSize}
          x={pieceX}
          y={pieceY}
        />
      </div>
    </>
  );
}

export default BoardTouch;
