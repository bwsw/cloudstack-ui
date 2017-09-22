import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';
import { Domain } from "../models/domain.model";

@Injectable()
@BackendResource({
  entity: 'Domain',
  entityModel: Domain
})
export class DomainService extends BaseBackendService<Domain> {

}
