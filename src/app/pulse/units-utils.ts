import { Dictionary } from '@ngrx/entity';

const bytes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const siBytes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const siBits = ['bits', 'kbits', 'Mbits', 'Gbits', 'Tbits', 'Pbits', 'Ebits', 'Zbits', 'Ybits'];

function getUnitName(translations: Dictionary<string>, units: string[], index: number) {
  return translations && translations[units[index].toUpperCase()]
    ? translations[units[index].toUpperCase()]
    : units[index];
}

function getSize(
  size: number,
  units: string[],
  kB: number,
  translations?: Dictionary<string>,
): string {
  let u = 0;

  if (Math.abs(size) < kB) {
    if (Math.abs(size) <= 1) {
      return Math.abs(size) % 1 === 0
        ? `${size.toFixed(0)} ${getUnitName(translations, units, u)}`
        : null;
    }
    return `${size.toFixed(1)} ${getUnitName(translations, units, u)}`;
  }

  let localSize = size;
  do {
    localSize /= kB;
    u += 1;
  } while (Math.abs(localSize) >= kB && u < units.length - 1);

  return `${localSize.toFixed(1)} ${getUnitName(translations, units, u)}`;
}

// size in bytes
export function humanReadableSize(
  size: number,
  si = false,
  translations?: Dictionary<string>,
): string {
  const kB = si ? 1000 : 1024;
  const units = si ? siBytes : bytes;
  return getSize(size, units, kB, translations);
}

export function humanReadableSizeInBits(size: number, translations?: Dictionary<string>): string {
  return getSize(size, siBits, 1000, translations);
}
