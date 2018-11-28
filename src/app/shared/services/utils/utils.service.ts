import * as uuid from 'uuid';
import { Time } from '../../components/time-picker/time-picker.component';
import { DayPeriod } from '../../components/day-period/day-period.component';

interface RouterState {
  snapshot: {
    url: string;
  };
}

export class Utils {
  public static defaultPrecision = 0;

  public static getUniqueId(): string {
    return uuid.v4();
  }

  public static divide(
    enumerator: number,
    denominator: number,
    denominatorExponent?: number,
    precision: number = Utils.defaultPrecision,
  ): number {
    const calculatedExponent = denominatorExponent != null ? denominatorExponent : 1;
    const calculatedDenominator = Math.pow(denominator, calculatedExponent);

    if (precision != null) {
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

  public static convertAmPmTo24(time: Time): Time {
    if (time == null || time.period == null) {
      return time;
    }

    if (time.period === DayPeriod.Am) {
      if (time.hour === 12) {
        return {
          hour: 0,
          minute: time.minute,
        };
      }
      return {
        hour: time.hour,
        minute: time.minute,
      };
    }

    if (time.hour === 12) {
      return {
        hour: 12,
        minute: time.minute,
      };
    }

    return {
      hour: time.hour + 12,
      minute: time.minute,
    };
  }

  public static convert24ToAmPm(time: Time): Time {
    if (time == null || time.period != null) {
      return time;
    }

    if (time.hour < 12) {
      if (time.hour === 0) {
        return {
          hour: 12,
          minute: time.minute,
          period: DayPeriod.Am,
        };
      }
      return {
        hour: time.hour,
        minute: time.minute,
        period: DayPeriod.Am,
      };
    }

    if (time.hour === 12) {
      return {
        hour: 12,
        minute: time.minute,
        period: DayPeriod.Pm,
      };
    }

    return {
      hour: time.hour - 12,
      minute: time.minute,
      period: DayPeriod.Pm,
    };
  }
}
