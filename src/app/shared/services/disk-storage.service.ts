import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ResourceLimitService } from './resource-limit.service';
import { VolumeService } from './volume.service';
import { Volume } from '../models';
import { SnapshotService } from './snapshot.service';
import { Iso, IsoService } from '../../template/shared';
import { ResourceType, Snapshot } from '../models';


@Injectable()
export class DiskStorageService {
  constructor(
    private resourceLimits: ResourceLimitService,
    private volume: VolumeService,
    private snapshotService: SnapshotService,
    private isoService: IsoService,
  ) {}

  public getAvailablePrimaryStorage(): Observable<number> {
    return this.getAvailableStorage(ResourceType.PrimaryStorage);
  }

  public getConsumedPrimaryStorage(): Observable<number> {
    return this.volume.getList()
      .map(res => {
        return res.reduce((accum: number, current: Volume) => {
          return Math.floor(accum + +current.size / Math.pow(2, 30));
        }, 0);
      });
  }

  public getConsumedSecondaryStorage(): Observable<number> {
    return Observable.forkJoin([
      this.snapshotService.getList(),
      this.isoService.getList({ isoFilter: 'self' })
    ]).map((result: Array<any>) => {
      let consumedSecondaryStorage = 0;
      result[0].forEach((snapshot: Snapshot) => {
        consumedSecondaryStorage += snapshot.physicalSize;
      });
      result[1].forEach((iso: Iso) => {
        consumedSecondaryStorage += iso.size;
      });
      return Math.floor(consumedSecondaryStorage / Math.pow(2, 30));
    });
  }

  private getConsumedStorage(resourceType: ResourceType): Observable<number> {
    if (resourceType === ResourceType.PrimaryStorage) {
      return this.getConsumedPrimaryStorage();
    } else {
      return this.getConsumedSecondaryStorage();
    }
  }

  private getAvailableStorage(resourceType: ResourceType): Observable<number> {
    let limitRequest = this.resourceLimits.getList({ resourceType })
      .map(res => res[0].max);

    let consumedStorageRequest = this.getConsumedStorage(resourceType);

    return Observable.forkJoin([limitRequest, consumedStorageRequest])
      .map(values => {
        if (values[0] === -1) {
          return -1;
        }
        let space = values[0] - values[1];
        return space > 0 ? space : 0;
      })
      .catch(error => Observable.throw(error));
  }
}
