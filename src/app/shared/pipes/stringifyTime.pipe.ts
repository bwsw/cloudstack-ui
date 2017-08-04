import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormatterService } from '../services/date-time-formatter.service';


@Pipe({
  name: 'stringifyTime'
})
export class StringifyTimePipe implements PipeTransform {
  constructor(private dateTimeFormatterService: DateTimeFormatterService) {}

  public transform(value: Date): string {
    return this.dateTimeFormatterService.stringifyToTime(value);
  }
}
