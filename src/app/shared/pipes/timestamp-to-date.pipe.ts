import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'csTimestampToDate',
})
export class TimestampToDatePipe implements PipeTransform {
  public transform(timestamp: string): Date {
    return moment(timestamp).toDate();
  }
}
