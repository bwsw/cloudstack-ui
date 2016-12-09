import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AffinityGroup } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';

import { NotificationService } from '../notification.service';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroup
})
export class AffinityGroupService extends BaseBackendService<AffinityGroup> {
  constructor(http: Http, notification: NotificationService) {
    super(http, notification);
  }
}
