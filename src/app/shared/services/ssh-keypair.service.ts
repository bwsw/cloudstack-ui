import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SSHKeyPair } from '../models/ssh-keypair.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendCachedService } from './base-backend-cached.service';


@Injectable()
@BackendResource({
  entity: 'SSHKeyPair',
  entityModel: SSHKeyPair
})
export class SSHKeyPairService extends BaseBackendCachedService<SSHKeyPair> {
  public create(params?: {}): Observable<SSHKeyPair> {
    return this.sendCommand('create', params)
      .map(response => this.prepareModel(response['keypair']))
      .catch(error => Observable.throw(error.json()['createsshkeypairresponse']));
  }

  public register(params?: {}): Observable<SSHKeyPair> {
    return this.sendCommand('register', params)
      .map(response => this.prepareModel(response['keypair']))
      .catch(error => Observable.throw(error.json()['registersshkeypairresponse']));
  }
}

