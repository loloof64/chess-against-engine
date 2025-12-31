import useClockHook from "../../hooks/useClockHook";
import "./Clock.css";
import ClockSide from "./ClockSide";

function Clock() {
  const { isWhiteRunning } = useClockHook();
  return (
    <div className="chessClock">
      <ClockSide isWhite={true} isRunning={isWhiteRunning} />
      <ClockSide isWhite={false} isRunning={!isWhiteRunning} />
    </div>
  );
}

export default Clock;
