import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { Iso } from './iso.model';
import { OsTypeService } from '../../shared/services/os-type.service';

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
  constructor(private osTypeService: OsTypeService) {
    super();
  }

  public get(id: string, params?: IsoRequestParams): Observable<Iso> {
    const isofilter = params.isofilter ? params.isofilter : 'featured';
    return Observable.forkJoin([
      this.getList({ isofilter, id }),
      this.osTypeService.getList()
    ])
      .map(([isos, osTypes]) => {
        isos[0].osType = osTypes.find(osType => osType.id === isos[0].osTypeId);
        return isos[0];
      })
      .catch(error => Observable.throw(error));
  }

  public getList(params: IsoRequestParams): Observable<Array<Iso>> {
    return Observable.forkJoin([
      super.getList(params),
      this.osTypeService.getList()
    ])
      .map(([isos, osTypes]) => {
        isos.forEach(iso => {
          iso.osType = osTypes.find(osType => osType.id === iso.osTypeId);
        });
        return isos;
      });
  }
}
