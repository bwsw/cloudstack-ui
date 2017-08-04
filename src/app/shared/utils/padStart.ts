export function padStart(value: string | number, digitsRequired: number): string {
  const numberOfDigits = value.toString().length;
  const digitsToBeAdded = digitsRequired - numberOfDigits;

  if (digitsToBeAdded <= 0) {
    return `${+value}`;
  }

  return `${'0'.repeat(digitsToBeAdded)}${+value}`;
}
