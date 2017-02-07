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
  public getList(params?: {}): Observable<Array<OsType>> {
    return super.getList(params)
      .map(osTypes => {
        osTypes.forEach(osType => {
          osType.osFamily = this.mapOsFamily(osType.description);
        });

        return osTypes;
      });
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
