import { Square } from "chess.js";

export default function getSquare(file: number, rank: number): Square {
  const fileStr = String.fromCharCode("a".charCodeAt(0) + file);
  const rankStr = String.fromCharCode("1".charCodeAt(0) + rank);
  return `${fileStr}${rankStr}` as Square;
}
