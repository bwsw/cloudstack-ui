import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';
import { Role } from '../models/role.model';

@Injectable()
@BackendResource({
  entity: 'Role',
})
export class RoleService extends BaseBackendService<Role> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
