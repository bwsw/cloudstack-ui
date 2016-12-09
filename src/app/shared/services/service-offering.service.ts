import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ServiceOffering } from '../models/service-offering.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';

import { INotificationService } from '../notification.service';

@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends BaseBackendService<ServiceOffering> {
  constructor(
    http: Http,
    @Inject('INotificationService') notification: INotificationService) {
    super(http, notification);
  }
}
