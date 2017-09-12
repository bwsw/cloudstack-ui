import * as uuid from 'uuid';
import { NavigationExtras } from '@angular/router';


export class Utils {
  public static getUniqueId(): string {
    return uuid.v4();
  }

  public static divide(
    value: number,
    base: number,
    exponent: string,
    precision?: string
  ): number | string {
    const exp = parseInt(exponent, 10);
    const denominator = Math.pow(base, isNaN(exp) ? 1 : exp);
    let prec;
    if (precision) {
      prec = parseInt(precision, 10);
      return (value / denominator).toFixed(prec);
    }

    return value / denominator;
  }

  public static convertToGB(value?: number): number {
    if (value == null) {
      return 0;
    }
    return value / Math.pow(2, 30);
  }

  public static matchLower(string: string, subString: string): boolean {
    return string.toLowerCase().includes(subString.toLowerCase());
  }

  public static getRedirectionQueryParams(next?: string, routerState?): NavigationExtras {
    return {
      queryParams: {
        next: next || this.getRouteWithoutQueryParams(routerState)
      }
    };
  }

  public static getRouteWithoutQueryParams(routerState): string {
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
