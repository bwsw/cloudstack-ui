import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';

import { Event } from './event.model';
import { BaseBackendService } from '../shared/services/base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Event',
  entityModel: Event
})
export class EventService extends BaseBackendService<Event> { }
