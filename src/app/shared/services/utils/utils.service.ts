import { RouterState } from '@angular/router';
import * as uuid from 'uuid';

export class Utils {
  public static getUniqueId(): string {
    return uuid.v4();
  }

  public static divide(
    enumerator: number,
    denominator: number,
    denominatorExponent?: number,
    precision?: number,
  ): number {
    const calculatedExponent = denominatorExponent != null ? denominatorExponent : 1;
    const calculatedDenominator = Math.pow(denominator, calculatedExponent);

    if (precision) {
      return +(enumerator / calculatedDenominator).toFixed(precision);
    }
    return enumerator / calculatedDenominator;
  }

  public static convertToGb(value?: number): number {
    if (value == null) {
      return 0;
    }
    return value / Math.pow(2, 30);
  }

  public static convertBytesToMegabytes(bytes: number): number | undefined {
    if (bytes == null) {
      return undefined;
    }
    return bytes / 1048576; // bytes / 2^20
  }

  public static matchLower(string: string, subString: string): boolean {
    return string && string.toLowerCase().includes(subString && subString.toLowerCase());
  }

  public static getRouteWithoutQueryParams(routerState: RouterState): string {
    if (routerState) {
      return routerState.snapshot.url.split('?')[0];
    }
    return '/';
  }

  public static convertBooleanStringToBoolean(booleanString: string): boolean {
    if (booleanString === 'true') {
      return true;
    }

    if (booleanString === 'false') {
      return false;
    }
  }

  public static convertBooleanToBooleanString(boolean: boolean): string {
    if (boolean) {
      return 'true';
    }

    if (!boolean) {
      return 'false';
    }
  }

  public static parseJsonString(string): any {
    try {
      return JSON.parse(string);
    } catch (e) {
      return null;
    }
  }

  public static isColorDark(color: string) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return darkness > 0.5;
  }

  public static sortByName = (a, b) => {
    return a.name && a.name.localeCompare(b.name);
  };
}
