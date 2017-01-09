import { Injectable } from '@angular/core';

import { SSHKeyPair } from '../models/SSHKeyPair.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: 'SSHKeyPair',
  entityModel: SSHKeyPair
})
export class SSHKeyPairService extends BaseBackendService<SSHKeyPair> { }

