import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AffinityGroupModel } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';

import { NotificationService } from '../notification.service';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroupModel
})
export class AffinityGroupService extends BaseBackendService<AffinityGroupModel> {
  constructor(http: Http, notification: NotificationService) {
    super(http, notification);
  }
}
