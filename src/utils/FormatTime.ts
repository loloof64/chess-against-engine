function formatTimeUnit(unit: number): string {
  return unit.toString().padStart(2, '0');
}

function formatTime(hours: number, minutes: number, seconds: number): string {
  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

export default formatTime;