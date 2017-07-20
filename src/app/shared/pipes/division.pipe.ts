import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../services';


@Pipe({
  // tslint:disable-next-line
  name: 'division'
})
export class DivisionPipe implements PipeTransform {
  public transform(value: number, base: number, exponent: string, precision?: string): number|string {
    return Utils.divide(value, base, exponent, precision);
  }
}
