import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
@BackendResource({
  entity: '',
})
export class GatewayApiService extends BaseBackendService<Object> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public execute<M>(cmd: string, params?: Object): Observable<M> {
    return this.sendCommand('gatewayApi', { cmd, ...params }).pipe(
      map(res => {
        debugger;
        return this.getResponse(res);
      }),
      catchError(e => {
        debugger;
        return this.handleCommandError(e.error);
      }),
    );
  }
}
