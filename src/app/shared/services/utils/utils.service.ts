import * as uuid from 'uuid';
import { NavigationExtras, RouterState } from '@angular/router';


export class Utils {
  public static getUniqueId(): string {
    return uuid.v4();
  }

  public static divide(
    enumerator: number,
    denominator: number,
    denominatorExponent?: number,
    precision?: number
  ): number {
    const calculatedExponent = denominatorExponent != null ? denominatorExponent : 1;
    const calculatedDenominator = Math.pow(denominator, calculatedExponent);

    if (precision) {
      return +(enumerator / calculatedDenominator).toFixed(precision);
    } else {
      return enumerator / calculatedDenominator;
    }
  }

  public static convertToGb(value?: number): number {
    if (value == null) {
      return 0;
    }
    return value / Math.pow(2, 30);
  }

  public static matchLower(string: string, subString: string): boolean {
    return string.toLowerCase().includes(subString.toLowerCase());
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
    if (boolean === true) {
      return 'true';
    }

    if (boolean === false) {
      return 'false';
    }

    throw new Error('Invalid argument');
  }

  public static parseJsonString(string): any {
    try {
      return JSON.parse(string);
    } catch (e) {
      return null;
    }
  }
}
