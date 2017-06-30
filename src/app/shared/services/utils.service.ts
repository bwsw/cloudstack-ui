import * as uuid from 'uuid';


export class Utils {
  public static getUniqueId(): string {
    return uuid.v4();
  }

  public static divide(value: number, base: number, exponent: string, precision?: string): number|string {
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
}
