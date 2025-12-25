import { useRef, useState } from "react";
import "./BoardTouch.css";

interface BoardTouchParams {
  onTouch: (file: number, rank: number) => void;
  onMove: (file: number, rank: number) => void;
  onRelease: () => void;
}

interface TouchCoordinates {
  file: number;
  rank: number;
}

function BoardTouch({ onTouch, onMove, onRelease }: BoardTouchParams) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  function getTouchCoordinates(
    event: React.TouchEvent<HTMLDivElement>
  ): TouchCoordinates | null {
    if (!overlayRef.current) return null;
    const rect = overlayRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const squareSize = rect.width / 8;
    const file = Math.floor(x / squareSize);
    const rank = Math.floor(y / squareSize);

    return { file, rank };
  }

  function handleTouchDown(event: React.TouchEvent<HTMLDivElement>): void {
    const coordinates = getTouchCoordinates(event);
    if (coordinates === null) return;
    const { file, rank } = coordinates;
    onTouch(file, rank);
  }

  function handleTouchUp(): void {
    onRelease();
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    const coordinates = getTouchCoordinates(event);
    if (coordinates === null) return;
    const { file, rank } = coordinates;
    onMove(file, rank);
  }

  return (
    <>
      <div
        className="boardTouch"
        ref={overlayRef}
        onTouchStart={handleTouchDown}
        onTouchEnd={handleTouchUp}
        onTouchMove={handleTouchMove}
      ></div>
    </>
  );
}

export default BoardTouch;
