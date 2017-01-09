import { Injectable } from '@angular/core';

import { Iso } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';

import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseBackendService<Iso> {
  public get(id: string): Promise<Iso> {
    const isofilter = 'featured';
    return this.getList({isofilter, id})
      .then(data => data[0])
      .catch(error => Promise.reject(error));
  }

  public getList(params: { isofilter: string, [propName: string]: any }): Promise<Array<Iso>> {
    return super.getList(params);
  }
}
