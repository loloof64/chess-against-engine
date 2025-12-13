import { useEffect, useState } from "react";
import "./ValueSelector.css";

import WhitePawn from "./vectors/Chess_plt45.svg";
import WhiteKnight from "./vectors/Chess_nlt45.svg";
import WhiteBishop from "./vectors/Chess_blt45.svg";
import WhiteRook from "./vectors/Chess_rlt45.svg";
import WhiteQueen from "./vectors/Chess_qlt45.svg";
import WhiteKing from "./vectors/Chess_klt45.svg";

import BlackPawn from "./vectors/Chess_pdt45.svg";
import BlackKnight from "./vectors/Chess_ndt45.svg";
import BlackBishop from "./vectors/Chess_bdt45.svg";
import BlackRook from "./vectors/Chess_rdt45.svg";
import BlackQueen from "./vectors/Chess_qdt45.svg";
import BlackKing from "./vectors/Chess_kdt45.svg";

enum PieceColor {
  white,
  black,
}

enum PieceType {
  none,
  pawn,
  knight,
  bishop,
  rook,
  queen,
  king,
}

enum PreviewType {
  TrashBin,
  whitePawn,
  whiteKnight,
  whiteBishop,
  whiteRook,
  whiteQueen,
  whiteKing,
  blackPawn,
  blackKnight,
  blackBishop,
  blackRook,
  blackQueen,
  blackKing,
}

function ValueSelector() {
  const [pieceColor, setPieceColor] = useState(PieceColor.white);
  const [pieceType, setPieceType] = useState(PieceType.none);
  const [preview, setPreview] = useState(PreviewType.TrashBin);

  function handleWhiteClick() {
    setPieceColor(PieceColor.white);
  }

  function handleBlackClick() {
    setPieceColor(PieceColor.black);
  }

  useEffect(() => {
    updatePreview();
  }, [pieceColor, pieceType]);

  function updatePreview() {
    switch (pieceType) {
      case PieceType.none:
        setPreview(PreviewType.TrashBin);
        break;
      case PieceType.pawn:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whitePawn
            : PreviewType.blackPawn
        );
        break;
      case PieceType.knight:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whiteKnight
            : PreviewType.blackKnight
        );
        break;
      case PieceType.bishop:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whiteBishop
            : PreviewType.blackBishop
        );
        break;
      case PieceType.rook:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whiteRook
            : PreviewType.blackRook
        );
        break;
      case PieceType.queen:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whiteQueen
            : PreviewType.blackQueen
        );
        break;
      case PieceType.king:
        setPreview(
          pieceColor === PieceColor.white
            ? PreviewType.whiteKing
            : PreviewType.blackKing
        );
        break;
    }
  }

  function getPreviewImage(type: PreviewType) {
    switch (type) {
      case PreviewType.TrashBin:
        return "";
      case PreviewType.whitePawn:
        return WhitePawn;
      case PreviewType.whiteKnight:
        return WhiteKnight;
      case PreviewType.whiteBishop:
        return WhiteBishop;
      case PreviewType.whiteRook:
        return WhiteRook;
      case PreviewType.whiteQueen:
        return WhiteQueen;
      case PreviewType.whiteKing:
        return WhiteKnight;
      case PreviewType.blackPawn:
        return BlackPawn;
      case PreviewType.blackKnight:
        return BlackKnight;
      case PreviewType.blackBishop:
        return BlackBishop;
      case PreviewType.blackRook:
        return BlackRook;
      case PreviewType.blackQueen:
        return BlackQueen;
      case PreviewType.blackKing:
        return BlackKing;
    }
  }

  return (
    <div className="valueSelector">
      <div className="preview">
        {preview !== PreviewType.TrashBin && (
          <img src={getPreviewImage(preview)} />
        )}
      </div>
      <div className="buttons">
        <div className="buttonsLine">
          <button className="white-bg" onClick={handleWhiteClick}></button>
          <button onClick={() => setPieceType(PieceType.pawn)}>
            <img
              src={pieceColor === PieceColor.white ? WhitePawn : BlackPawn}
            />
          </button>
          <button onClick={() => setPieceType(PieceType.knight)}>
            <img
              src={pieceColor === PieceColor.white ? WhiteKnight : BlackKnight}
            />
          </button>
          <button onClick={() => setPieceType(PieceType.bishop)}>
            <img
              src={pieceColor === PieceColor.white ? WhiteBishop : BlackBishop}
            />
          </button>
          <button onClick={() => setPreview(PreviewType.TrashBin)}>🗑</button>
        </div>
        <div className="buttonsLine">
          <button className="black-bg" onClick={handleBlackClick}></button>
          <button onClick={() => setPieceType(PieceType.rook)}>
            <img
              src={pieceColor === PieceColor.white ? WhiteRook : BlackRook}
            />
          </button>
          <button onClick={() => setPieceType(PieceType.queen)}>
            <img
              src={pieceColor === PieceColor.white ? WhiteQueen : BlackQueen}
            />
          </button>
          <button onClick={() => setPieceType(PieceType.king)}>
            <img
              src={pieceColor === PieceColor.white ? WhiteKing : BlackKing}
            />
          </button>
          <button onClick={() => setPieceType(PieceType.none)}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default ValueSelector;
