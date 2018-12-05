import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendResource } from '../decorators';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { Capabilities } from '../models/capabilities.model';

@Injectable()
@BackendResource({
  entity: '',
})
export class CapabilityService extends BaseBackendService<Capabilities> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public get(): Observable<Capabilities> {
    return this.sendCommand(CSCommands.ListCapabilities, {}, '').pipe(
      map(({ capability }) => capability),
    );
  }
}
