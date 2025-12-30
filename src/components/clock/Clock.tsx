import "./Clock.css";
import ClockSide from "./ClockSide";

function Clock() {
  return (
    <div className="chessClock">
      <ClockSide isWhite={true} isRunning={true} />
      <ClockSide isWhite={false} isRunning={false} />
    </div>
  );
}

export default Clock;
