import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import { BaseBackendService, FormattedResponse } from '../shared/services/base-backend.service';

import { Event } from './event.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';

@Injectable()
@BackendResource({
  entity: 'Event',
})
export class EventService extends BaseBackendService<Event> {
  constructor(
    protected http: HttpClient,
    private dateTimeFormatterService: DateTimeFormatterService,
  ) {
    super(http);
  }

  protected formatGetListResponse(response: any): FormattedResponse<Event> {
    const result = super.formatGetListResponse(response);
    return {
      list: result.list.map(m => this.prepareEventModel(m)),
      meta: result.meta,
    };
  }

  private prepareEventModel(event): Event {
    event.created = moment(event.created).toDate();
    event.time = this.dateTimeFormatterService.stringifyToTime(event.created);
    return event;
  }
}
