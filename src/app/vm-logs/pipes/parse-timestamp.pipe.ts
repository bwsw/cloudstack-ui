import { Pipe, PipeTransform } from '@angular/core';
import moment = require('moment');


@Pipe({
  name: 'parseTimestamp'
})
export class ParseTimestampPipe implements PipeTransform {
  public transform(timestamp: string): Date {
    return moment(timestamp).toDate();
  }
}
