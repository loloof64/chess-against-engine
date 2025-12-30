import { Square } from "chess.js";

export  function getSquare(file: number, rank: number): Square {
  const fileStr = String.fromCharCode("a".charCodeAt(0) + file);
  const rankStr = String.fromCharCode("1".charCodeAt(0) + rank);
  return `${fileStr}${rankStr}` as Square;
}

export function hasWhiteTurn(fen: string): boolean {
  return fen.split(" ")[1] !== "b";
}