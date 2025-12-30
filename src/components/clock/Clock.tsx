import "./Clock.css";
import ClockSide from "./ClockSide";

function Clock() {
  return (
    <div className="chessClock">
      <ClockSide />
      <ClockSide />
    </div>
  );
}

export default Clock;
