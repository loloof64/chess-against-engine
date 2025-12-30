import "./ClockSide.css";

interface ClockSideParams {
  isWhite: boolean;
  isRunning: boolean;
}

function ClockSide({ isWhite, isRunning }: ClockSideParams) {
  const timeStr = "00:00:00";
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
