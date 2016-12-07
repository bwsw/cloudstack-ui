import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ServiceOffering } from '../models/service-offering.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';

import { AlertService } from '.';

@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends BaseBackendService<ServiceOffering> {
  constructor(http: Http, alert: AlertService) {
    super(http, alert);
  }
}
