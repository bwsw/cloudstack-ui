import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';
import { Configuration } from '../models/configuration.model';
import { Observable } from 'rxjs/Observable';
import { Account } from '../models/account.model';
import { AsyncJobService } from './async-job.service';

@Injectable()
@BackendResource({
  entity: 'Configuration',
  entityModel: Configuration
})
export class ConfigurationService extends BaseBackendService<Configuration> {
  constructor(protected http: HttpClient, private asyncJob: AsyncJobService) {
    super(http);
  }

  /*public update(accountid: string, name: string, value: any): Observable<any> {
    return this.postRequest('update', { accountid, name, value });
  }*/

  public updateConfiguration(
    configuration: Configuration,
    account?: Account
  ): Observable<Configuration> {
    return this.sendCommand('update', {
      accountid: account.id,
      name: configuration.name,
      value: configuration.value
    });
  }

}
