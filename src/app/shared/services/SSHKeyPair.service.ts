import { Injectable } from '@angular/core';

import { SSHKeyPair } from '../models/SSHKeyPair.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendCachedService } from './base-backend-cached.service';


@Injectable()
@BackendResource({
  entity: 'SSHKeyPair',
  entityModel: SSHKeyPair
})
export class SSHKeyPairService extends BaseBackendCachedService<SSHKeyPair> { }

