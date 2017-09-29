import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import { BaseBackendService } from '../shared/services/base-backend.service';

import { Event } from './event.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
@BackendResource({
  entity: 'Event',
  entityModel: Event
})
export class EventService extends BaseBackendService<Event> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
