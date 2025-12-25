import "./MovedPiece.css";

import WhitePawn from "../../assets/vectors/Chess_plt45.svg";
import WhiteKnight from "../../assets/vectors/Chess_nlt45.svg";
import WhiteBishop from "../../assets/vectors/Chess_blt45.svg";
import WhiteRook from "../../assets/vectors/Chess_rlt45.svg";
import WhiteQueen from "../../assets/vectors/Chess_qlt45.svg";
import WhiteKing from "../../assets/vectors/Chess_klt45.svg";

import BlackPawn from "../../assets/vectors/Chess_pdt45.svg";
import BlackKnight from "../../assets/vectors/Chess_ndt45.svg";
import BlackBishop from "../../assets/vectors/Chess_bdt45.svg";
import BlackRook from "../../assets/vectors/Chess_rdt45.svg";
import BlackQueen from "../../assets/vectors/Chess_qdt45.svg";
import BlackKing from "../../assets/vectors/Chess_kdt45.svg";
import { Piece } from "chess.js";

interface MovedPieceParams {
  piece: Piece | null;
  squareSize: number | null;
  x: number | null;
  y: number | null;
}

function MovedPiece({ piece, squareSize, x, y }: MovedPieceParams) {
  return (
    <div
      className="movedPieceRoot"
      style={{
        position: "absolute",
        left: x ?? 0,
        top: y ?? 0,
        width: squareSize ?? 0,
        height: squareSize ?? 0,
        zIndex: 8,
      }}
    >
      {piece?.type === "p" && piece?.color === "w" ? (
        <img src={WhitePawn} />
      ) : piece?.type === "n" && piece?.color === "w" ? (
        <img src={WhiteKnight} />
      ) : piece?.type === "b" && piece?.color === "w" ? (
        <img src={WhiteBishop} />
      ) : piece?.type === "r" && piece?.color === "w" ? (
        <img src={WhiteRook} />
      ) : piece?.type === "q" && piece?.color === "w" ? (
        <img src={WhiteQueen} />
      ) : piece?.type === "k" && piece?.color === "w" ? (
        <img src={WhiteKing} />
      ) : piece?.type === "p" && piece?.color === "b" ? (
        <img src={BlackPawn} />
      ) : piece?.type === "n" && piece?.color === "b" ? (
        <img src={BlackKnight} />
      ) : piece?.type === "b" && piece?.color === "b" ? (
        <img src={BlackBishop} />
      ) : piece?.type === "r" && piece?.color === "b" ? (
        <img src={BlackRook} />
      ) : piece?.type === "q" && piece?.color === "b" ? (
        <img src={BlackQueen} />
      ) : piece?.type === "k" && piece?.color === "b" ? (
        <img src={BlackKing} />
      ) : null}
    </div>
  );
}

export default MovedPiece;
