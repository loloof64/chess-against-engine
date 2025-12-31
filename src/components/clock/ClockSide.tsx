import { useEffect, useState } from "react";
import { useGame } from "../../stores/game/GameContext";
import { convertDecisecondsToTime, formatTime } from "../../utils/Time";
import "./ClockSide.css";

interface ClockSideParams {
  isWhite: boolean;
  isRunning: boolean;
}

function ClockSide({ isWhite, isRunning }: ClockSideParams) {
  const { whiteTimeDeciseconds, blackTimeDeciseconds } = useGame();
  const [timeStr, setTimeStr] = useState("--:--:--");

  useEffect(() => {
    setTimeStr(
      isWhite
        ? formatTime(convertDecisecondsToTime(whiteTimeDeciseconds))
        : formatTime(convertDecisecondsToTime(blackTimeDeciseconds))
    );
  }, [isWhite, whiteTimeDeciseconds, blackTimeDeciseconds]);
  return (
    <div
      className={`chessClockSide ${isWhite ? "white" : "black"} ${
        isRunning ? "running" : ""
      }`}
    >
      {timeStr}
    </div>
  );
}

export default ClockSide;
