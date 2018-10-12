import { Pipe, PipeTransform } from '@angular/core';
import moment = require('moment');
import { DateObject } from '../models/date-object.model';


@Pipe({
  name: 'dateObjectToDate'
})
export class DateObjectToDatePipe implements PipeTransform {
  public transform(object: DateObject): Date {
    return moment(object).toDate();
  }
}
