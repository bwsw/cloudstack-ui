import { Injectable } from '@angular/core';

import { AffinityGroup } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroup
})
export class AffinityGroupService extends BaseBackendService<AffinityGroup> {}
