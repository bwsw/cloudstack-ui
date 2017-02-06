import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendService } from '../../shared/services/base-backend.service';

import { Iso } from './iso.model';


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
