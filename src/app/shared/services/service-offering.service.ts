import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { BaseBackendCachedService } from '.';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends BaseBackendCachedService<ServiceOffering> {}
