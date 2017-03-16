import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  // tslint:disable-next-line
  name: 'division'
})
export class DivisionPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}

  public transform(value: number, base: number, exponent: string, precision?: string): number|string {
    return this.utilsService.divide(value, base, exponent, precision);
  }
}
