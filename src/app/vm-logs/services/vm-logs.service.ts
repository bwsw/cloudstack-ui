import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { Observable } from 'rxjs/index';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService, FormattedResponse } from '../../shared/services/base-backend.service';

@Injectable()
@BackendResource({
  entity: 'VmLog',
})
export class VmLogsService extends BaseBackendService<VmLog> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getList(params?: {}): Observable<VmLog[]> {
    const customApiFormat = { command: 'get;s', entity: 'VmLog' };
    return super.getList(params, customApiFormat);
  }

  protected formatGetListResponse(response: any): FormattedResponse<VmLog> {
    const result = (response && response.vmlogs && response.vmlogs.items) || [];
    return {
      list: result as VmLog[],
      meta: {
        count: response.vmlogs.count || 0,
      },
    };
  }
}
