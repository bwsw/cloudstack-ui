import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { ServiceOffering } from '../models/service-offering.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends BaseBackendService<ServiceOffering> {}
