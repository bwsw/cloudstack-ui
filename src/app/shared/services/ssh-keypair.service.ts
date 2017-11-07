import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { BackendResource } from '../decorators';

import { SSHKeyPair } from '../models';
import { AsyncJobService } from './async-job.service';
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
  protected account: string;

  constructor(private asyncJobService: AsyncJobService,
              protected http: HttpClient,
              protected activatedRoute: ActivatedRoute) {
    super(http);

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.account = params['account'];
    });
  }

  public getByName(name: string, account?: string): Observable<SSHKeyPair> {
    const params = account ? { name, account } : { name };
    return this.getList(params).map(sshKeys => sshKeys[0]);
  }

  public create(params: SshKeyCreationData): Observable<SSHKeyPair> {
    this.invalidateCache();
    return this.sendCommand('create', params)
      .map(response => this.prepareModel(response['keypair']));
  }

  public register(params: SshKeyCreationData): Observable<SSHKeyPair> {
    this.invalidateCache();
    return this.sendCommand('register', params)
      .map(response => this.prepareModel(response['keypair']));
  }

  public reset(params): Observable<VirtualMachine> {
    return this.sendCommand('reset;ForVirtualMachine', params, 'SSHKey')
      .switchMap(job =>
        this.asyncJobService.queryJob(job.jobid, 'VirtualMachine', VirtualMachine)
      );
  }
}
