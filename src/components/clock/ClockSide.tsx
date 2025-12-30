import { useEffect, useState } from "react";
import { useGame } from "../../stores/game/GameContext";
import formatTime from "../../utils/FormatTime";
import "./ClockSide.css";

interface ClockSideParams {
  isWhite: boolean;
  isRunning: boolean;
}

function ClockSide({ isWhite, isRunning }: ClockSideParams) {
  const {whiteTimeHours, whiteTimeMinutes, whiteTimeSeconds, blackTimeHours, blackTimeMinutes, blackTimeSeconds } = useGame()  
  const [timeStr, setTimeStr] = useState("--:--:--");
  
  useEffect(() => {
    setTimeStr(isWhite ? formatTime(whiteTimeHours, whiteTimeMinutes, whiteTimeSeconds) : formatTime(blackTimeHours, blackTimeMinutes, blackTimeSeconds));
  }, [isWhite, whiteTimeHours, whiteTimeMinutes, whiteTimeSeconds, blackTimeHours, blackTimeMinutes, blackTimeSeconds]);
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
