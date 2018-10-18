import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { OsFamily, OsType } from '../models';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
@BackendResource({
  entity: 'OsType',
})
export class OsTypeService extends BaseBackendService<OsType> {
  private osTypes: OsType[];
  private requestObservable: Observable<OsType[]>;

  constructor(protected http: HttpClient) {
    super(http);
  }

  public get(id: string): Observable<OsType> {
    if (this.osTypes) {
      return of(this.osTypes.find(osType => osType.id === id));
    }

    return super.get(id);
  }

  public getList(params?: {}): Observable<OsType[]> {
    if (this.osTypes) {
      return of(this.osTypes);
    }

    if (this.requestObservable) {
      return this.requestObservable;
    }

    this.requestObservable = super.getList(params).pipe(
      map(osTypes => {
        osTypes.forEach(osType => {
          osType.osFamily = this.mapOsFamily(osType.description);
        });

        this.osTypes = osTypes;
        return osTypes;
      }),
    );
    return this.requestObservable;
  }

  private mapOsFamily(osName): OsFamily {
    const windows = OsFamily.Windows;
    if (osName.includes(windows) || osName.includes('Microsoft')) {
      return windows;
    }

    const macOs = OsFamily.MacOs;
    if (osName.includes(macOs)) {
      return macOs;
    }

    const linux = OsFamily.Linux;
    if (osName.includes(linux)) {
      return linux;
    }

    if (
      osName.includes('CentOS') ||
      osName.includes('Debian') ||
      osName.includes('Fedora') ||
      osName.includes('Ubuntu')
    ) {
      return linux;
    }

    return OsFamily.Other;
  }
}
