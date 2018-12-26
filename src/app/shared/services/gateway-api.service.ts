import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable()
@BackendResource({
  entity: 'gatewayApi',
})
export class GatewayApiService extends BaseBackendService<Object> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public execute<M>(cmd: string, params?: Object): Observable<M> {
    return this.sendCommand('', { cmd, ...params }).pipe(
      map(res => {
        const body = this.getResponse(res);

        if (body.failure) {
          throw body.failure.response;
        }

        return body.success.response;
      }),
      catchError(e => {
        return throwError(ErrorService.parseError(e));
      }),
    );
  }
}
