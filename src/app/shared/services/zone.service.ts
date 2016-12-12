import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Zone } from '../models/zone.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'Zone',
  entityModel: Zone
})
export class ZoneService extends BaseBackendService<Zone> { }
