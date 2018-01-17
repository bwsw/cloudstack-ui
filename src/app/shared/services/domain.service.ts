import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AuthService } from './auth.service';
import { ApiFormat, BaseBackendService } from './base-backend.service';
import { Domain } from '../models/domain.model';

@Injectable()
@BackendResource({
  entity: 'Domain'
})
export class DomainService extends BaseBackendService<Domain> {
  constructor(
    protected http: HttpClient,
    private authService: AuthService
  ) {
    super(http);
  }

  public getList(params?: {}, customApiFormat?: ApiFormat): Observable<Array<Domain>> {
    let requestParams;

    if (!this.authService.isAdmin()) {
      requestParams = Object.assign(
        { id: this.authService.user.domainid },
        params,
        { listAll: false }
      );
    } else {
      requestParams = this.extendParams(params);
    }

    return this.makeGetListObservable(requestParams, customApiFormat)
      .map(r => r.list);
  }
}
