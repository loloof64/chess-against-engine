import { useEffect, useState } from "react";
import "./BoardCoordinates.css";

const availableFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
const availableRanks = [8, 7, 6, 5, 4, 3, 2, 1];

type BoardOrientation = "white" | "black" | undefined;

interface BoardCoordinatesParams {
  isWhiteTurn: boolean;
  boardOrientation: BoardOrientation;
  hoveredFile: number | null;
  hoveredRank: number | null;
  startFile: number | null;
  startRank: number | null;
  children: any;
}

function BoardCoordinates({
  isWhiteTurn,
  boardOrientation,
  hoveredFile,
  hoveredRank,
  startFile,
  startRank,
  children,
}: BoardCoordinatesParams) {
  const [files, setFiles] = useState(availableFiles);
  const [ranks, setRanks] = useState(availableRanks);

  useEffect(() => {
    const whiteAtBottom = boardOrientation === "white";
    setFiles(
      whiteAtBottom ? availableFiles : availableFiles.map((e) => e).reverse()
    );
    setRanks(
      whiteAtBottom ? availableRanks : availableRanks.map((e) => e).reverse()
    );
  }, [boardOrientation]);

  return (
    <div className="chessboard-coords-outergrid">
      {/* Top row: corner, files, corner */}
      <div className="corner" />
      {files.map((file, idx) => (
        <div
          className={`file-label top ${idx === hoveredFile ? "hovered" : ""} ${
            idx === startFile ? "start" : ""
          }`}
          key={"top-" + file}
          style={{ gridColumn: idx + 2 }}
        >
          {file}
        </div>
      ))}
      <div className="corner" />
      {/* Board rows: rank, board, rank */}
      {ranks.map((rank, i) => [
        <div
          className={`rank-label left ${
            7 - i === hoveredRank ? "hovered" : ""
          } ${7 - i === startRank ? "start" : ""}`}
          key={"left-" + rank}
        >
          {rank}
        </div>,
        i === 0 ? (
          <div
            className="board-area"
            key={"board-area"}
            style={{ gridRow: `2 / span 8`, gridColumn: `2 / span 8` }}
          >
            {children}
          </div>
        ) : null,
        <div
          className={`rank-label right ${
            7 - i === hoveredRank ? "hovered" : ""
          } ${7 -   i === startRank ? "start" : ""}`}
          key={"right-" + rank}
        >
          {rank}
        </div>,
      ])}
      {/* Bottom row: corner, files, corner */}
      <div className="corner" />
      {files.map((file, idx) => (
        <div
          className={`file-label bottom ${
            idx === hoveredFile ? "hovered" : ""
          } ${idx === startFile ? "start" : ""}`}
          key={"bottom-" + file}
          style={{ gridColumn: idx + 2 }}
        >
          {file}
        </div>
      ))}
      <div className={`corner turn ${isWhiteTurn ? "white" : "black"}`} />
    </div>
  );
}

export default BoardCoordinates;
