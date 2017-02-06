import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Iso } from '../models';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';

interface IsoRequestParams {
  isofilter: string;
  [propName: string]: any;
}

@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseBackendService<Iso> {
  public get(id: string, params?: IsoRequestParams): Observable<Iso> {
    const isofilter = params.isofilter ? params.isofilter : 'featured';
    return this.getList({ isofilter, id })
      .map(data => data[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: IsoRequestParams): Observable<Array<Iso>> {
    return <Observable<Array<Iso>>>super.getList(params);
  }
}
