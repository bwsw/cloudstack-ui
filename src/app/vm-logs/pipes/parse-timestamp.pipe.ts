import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'csParseTimestamp',
})
export class ParseTimestampPipe implements PipeTransform {
  public transform(timestamp: string): Date {
    return moment(timestamp).toDate();
  }
}
