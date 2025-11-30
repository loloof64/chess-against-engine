const MAX_KEY_LENGTH = 30;
const ELEMENTS = "abcdefghijklmnopqrstuvwxyz0123456789,;:!%@&#'";

function randomInt(maxValueExclusive: number): number {
  const maxValue = Math.floor(maxValueExclusive);
  return Math.floor(Math.random() * maxValue);
}

export default function generateKey(): string {
  let result = "";
  const length = randomInt(MAX_KEY_LENGTH);

  for (let i = 0; i < length; i++) {
    const newElement = ELEMENTS[randomInt(ELEMENTS.length)];
    result += newElement;
  }

  return result;
}
