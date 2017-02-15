import { Injectable } from '@angular/core';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { DiskOffering } from '../models/disk-offering.model';


@Injectable()
@BackendResource({
  entity: 'DiskOffering',
  entityModel: DiskOffering
})
export class DiskOfferingService extends BaseBackendService<DiskOffering> {}
