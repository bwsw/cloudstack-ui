import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SSHKeyPair } from '../models';
import { BackendResource } from '../decorators';
import { BaseBackendCachedService } from './base-backend-cached.service';


export interface SshKeyCreationData {
  name: string;
  publicKey?: string;
}

@Injectable()
@BackendResource({
  entity: 'SSHKeyPair',
  entityModel: SSHKeyPair
})
export class SSHKeyPairService extends BaseBackendCachedService<SSHKeyPair> {
  public create(params: SshKeyCreationData): Observable<SSHKeyPair> {
    return this.sendCommand('create', params)
      .map(response => this.prepareModel(response['keypair']));
  }

  public register(params: SshKeyCreationData): Observable<SSHKeyPair> {
    return this.sendCommand('register', params)
      .map(response => this.prepareModel(response['keypair']));
  }
}
