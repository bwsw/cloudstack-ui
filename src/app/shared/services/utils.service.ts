import { Injectable } from '@angular/core';
import * as uuid from 'uuid';


@Injectable()
export class UtilsService {
  public get locationOrigin(): string {
    if (location.origin) {
      return location.origin;
    } else {
      return '' + location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    }
  }

  public getUniqueId(): string {
    return uuid.v4();
  }

  public divide(value: number, base: number, exponent: string, precision?: string): number|string {
    const exp = parseInt(exponent, 10);
    const denominator = Math.pow(base, isNaN(exp) ? 1 : exp);
    let prec;
    if (precision) {
      prec = parseInt(precision, 10);
      return (value / denominator).toFixed(prec);
    }

    return value / denominator;
  }

  public convertToGB(value: number): number {
    return value / Math.pow(2, 30);
  }
}
