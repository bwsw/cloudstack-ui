import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  // tslint:disable-next-line
  name: 'divByPowerOfTwo'
})
export class DivByPowerOfTwoPipe implements PipeTransform {
  public transform(value: number, exponent: string, precision?: string): number|string {
    const exp = parseInt(exponent, 10);
    const denominator = Math.pow(2, isNaN(exp) ? 1 : exp);
    let prec;
    if (precision) {
      prec = parseInt(precision, 10);
      return (value / denominator).toFixed(prec);
    }

    return value / denominator;
  }
}
