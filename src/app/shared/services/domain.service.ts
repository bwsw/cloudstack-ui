import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';
import { Domain } from '../models/domain.model';

@Injectable()
@BackendResource({
  entity: 'Domain',
})
export class DomainService extends BaseBackendService<Domain> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
