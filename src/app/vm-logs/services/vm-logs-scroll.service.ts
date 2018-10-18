import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { Observable } from 'rxjs/index';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services/base-backend.service';


@Injectable()
@BackendResource({
  entity: 'ScrollVmLog'
})
export class VmLogsScrollService extends BaseBackendService<VmLog> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public scroll(params?: {}): Observable<any> {
    const customApiFormat = { command: 'scroll;s', entity: 'ScrollVmLog' };
    return this.makeGetListObservable(this.extendParams(params), customApiFormat);
  }

  protected formatGetListResponse(response: any): any {
    const result = response && response.vmlogs && response.vmlogs.items || [];
    return {
      list: result.map(m => this.prepareModel(m)) as Array<VmLog>,
      meta: {
        scrollid: response.vmlogs.scrollid,
        count: response.vmlogs.count || 0
      }
    };
  }
}

