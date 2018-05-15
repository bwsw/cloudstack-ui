import { Params, RouterState, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { IPVersion } from '../../../security-group/sg.model';
import * as uuid from 'uuid';
import * as cidrRegex from 'cidr-regex';

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

  public static cidrIsValid(cidr: string | null): boolean {
    return cidrRegex({exact: true}).test(cidr);
  }

  public static cidrType(cidr: string | null): IPVersion | null {
    if (!Utils.cidrIsValid(cidr)) {
      return null;
    }
    const isIPv4 = cidrRegex.v4({exact: true}).test(cidr);

    if (isIPv4) {
      return IPVersion.ipv4;
    } else {
      return IPVersion.ipv6;
    }
  }
}


/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export class CustomRouterStateSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;

    return { url, queryParams };
  }
}
