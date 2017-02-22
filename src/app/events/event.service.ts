import { Injectable } from '@angular/core';

import { BaseBackendService } from '../shared/services/base-backend.service';
import { Event } from './event.model';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';

@Injectable()
@BackendResource({
  entity: 'Event',
  entityModel: Event
})
export class EventService extends BaseBackendService<Event> { }
