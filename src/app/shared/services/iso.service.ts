import { Injectable } from '@angular/core';

import { Iso } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';

import { BaseBackendService } from './base-backend.service';
import { Observable } from 'rxjs';

@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseBackendService<Iso> {
  public get(id: string): Observable<Iso> {
    const isofilter = 'featured';
    return this.getList({isofilter, id})
      .map(data => data[0])
      .catch(error => Observable.throw(error));
  }

  public getList(
    params: {
      isofilter: string,
      [propName: string]: any
    }): Observable<Array<Iso>> {
    return <Observable<Array<Iso>>>super.getList(params);
  }
}
