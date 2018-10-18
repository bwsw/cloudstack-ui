import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VmLog } from '../models/vm-log.model';
import { Observable, of, throwError } from 'rxjs/index';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { catchError } from 'rxjs/operators';


@Injectable()
@BackendResource({
  entity: 'VmLog'
})
export class VmLogsService extends BaseBackendService<VmLog> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getList(params?: {}): Observable<Array<VmLog>> {
    const customApiFormat = { command: 'get;s', entity: 'VmLog' };
    return super.getList(params, customApiFormat);
  }

  protected getRequest(
    command: string,
    params?: {},
    entity?: string
  ): Observable<any> {
    return super
      .getRequest(command, params, entity)
      .pipe(
        // todo: fix on backend
        catchError((response) =>  {
          try {
            return of(JSON.parse(response.error.text.replace(/\u001b.*\u001b/, '')));
          } catch {
            return throwError(response);
          }
        })
      );
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

