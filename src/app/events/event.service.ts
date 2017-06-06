import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';

import { BaseBackendService } from '../shared/services';
import { Event } from './event.model';

@Injectable()
@BackendResource({
  entity: 'Event',
  entityModel: Event
})
export class EventService extends BaseBackendService<Event> { }
