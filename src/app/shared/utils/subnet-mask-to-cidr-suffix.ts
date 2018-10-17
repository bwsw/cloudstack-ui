export function transformSubnetMaskToCidrSuffix(subnetMask: string): string {
  if (!subnetMask) {
    return '';
  }

  const parts = subnetMask.split('.');

  if (parts.length === 4) {
    const suffix = parts
      .map(maskPart => countOnesInBinaryRepresentation(+maskPart))
      .reduce((acc, length) => acc + length, 0);

    return `/${suffix}`;
  }
  return '';
}

function countOnesInBinaryRepresentation(number: number): number {
  return number.toString(2).replace(/0/g, '').length;
}
