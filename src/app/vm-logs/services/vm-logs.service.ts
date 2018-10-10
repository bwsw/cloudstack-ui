import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { Observable } from 'rxjs/index';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services/base-backend.service';


@Injectable()
@BackendResource({
  entity: 'VmLog'
})
export class VmLogsService extends BaseBackendService<VmLog> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getList(params?: {}): Observable<Array<VmLog>> {
    const customApiFormat = { command: 'get', entity: 'VmLog' };
    return super.getList(params, customApiFormat);
  }
}

