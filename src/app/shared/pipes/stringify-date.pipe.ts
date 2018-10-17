import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatterService } from '../services/date-time-formatter.service';

@Pipe({
  name: 'csStringifyDate',
})
export class StringifyDatePipe implements PipeTransform {
  constructor(private dateTimeFormatterService: DateTimeFormatterService) {}

  public transform(value: Date): string {
    return this.dateTimeFormatterService.stringifyToDate(value);
  }
}
