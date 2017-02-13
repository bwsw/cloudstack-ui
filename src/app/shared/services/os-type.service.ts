import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseBackendService } from '.';
import { BackendResource } from '../decorators';
import { OsType, OsFamily } from '../models/os-type.model';


@Injectable()
@BackendResource({
  entity: 'OsType',
  entityModel: OsType
})
export class OsTypeService extends BaseBackendService<OsType> {
  private osTypes: Array<OsType>;
  private requestObservable: Observable<Array<OsType>>;

  public get(id: string): Observable<OsType> {
    if (this.osTypes) {
      return Observable.of(this.osTypes.find(osType => osType.id === id));
    }

    return super.get(id);
  }

  public getList(params?: {}): Observable<Array<OsType>> {
    if (this.osTypes) {
      return Observable.of(this.osTypes);
    }

    if (this.requestObservable) {
      return this.requestObservable;
    }

    this.requestObservable = super.getList(params)
      .map(osTypes => {
        osTypes.forEach(osType => {
          osType.osFamily = this.mapOsFamily(osType.description);
        });

        this.osTypes = osTypes;
        return osTypes;
      });
    return this.requestObservable;
  }

  private mapOsFamily(osName): OsFamily {
    const windows: OsFamily = 'Windows';
    if (osName.includes(windows) || osName.includes('Microsoft')) {
      return windows;
    }

    const macOs: OsFamily = 'Mac OS';
    if (osName.includes(macOs)) {
      return macOs;
    }

    const linux: OsFamily = 'Linux';
    if (osName.includes(linux)) {
      return linux;
    }

    if (osName.includes('CentOS') || osName.includes('Debian') ||
      osName.includes('Fedora') || osName.includes('Ubuntu')) {
      return linux;
    }

    return 'Other';
  }
}
