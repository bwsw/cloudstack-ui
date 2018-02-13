import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { Configuration } from '../models/configuration.model';
import { Observable } from 'rxjs/Observable';
import { Account } from '../models/account.model';

@Injectable()
@BackendResource({
  entity: 'Configuration'
})
export class ConfigurationService extends BaseBackendService<Configuration> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateConfiguration(
    configuration: Configuration,
    account: Account
  ): Observable<Configuration> {
    return this.sendCommand(CSCommands.Update, {
      accountid: account.id,
      name: configuration.name,
      value: configuration.value
    });
  }

}
