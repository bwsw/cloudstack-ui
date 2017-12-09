import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import { BaseBackendService } from '../shared/services/base-backend.service';

import { Event } from './event.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';

@Injectable()
@BackendResource({
  entity: 'Event'
})
export class EventService extends BaseBackendService<Event> {
  constructor(
    protected http: HttpClient,
    private dateTimeFormatterService: DateTimeFormatterService
  ) {
    super(http);
  }

  protected prepareModel(res, entityModel?): Event {
    const event = super.prepareModel(res, this.entityModel);

    event.created = moment(res.created).toDate();
    event.time = this.dateTimeFormatterService.stringifyToTime(event.created);
    return event;
  }
}
