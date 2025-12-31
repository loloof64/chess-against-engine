interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

function formatTimeUnit(unit: number): string {
  return unit.toString().padStart(2, "0");
}

export function formatTime(time: Time): string {
  return `${formatTimeUnit(time.hours)}:${formatTimeUnit(
    time.minutes
  )}:${formatTimeUnit(time.seconds)}`;
}

export function convertTimeToDeciseconds(time: Time): number {
  return (time.hours * 3600 + time.minutes * 60 + time.seconds) * 10;
}

export function convertDecisecondsToTime(deciseconds: number): Time {
  let totalSeconds = deciseconds / 10;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds = totalSeconds % 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
  };
}
