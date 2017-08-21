import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ResourceLimitService } from './resource-limit.service';
import { VolumeService } from './volume.service';
import { Volume } from '../models';
import { SnapshotService } from './snapshot.service';
import { Iso, IsoService } from '../../template/shared';
import { ResourceType, Snapshot } from '../models';
import { MAX_ROOT_DISK_SIZE_ADMIN } from '../../vm/shared/vm.model';
import { TemplateService } from '../../template/shared/template.service';
import { Template } from '../../template/shared/template.model';
import { TemplateFilters } from '../../template/shared/base-template.service';


@Injectable()
export class DiskStorageService {
  constructor(
    private resourceLimits: ResourceLimitService,
    private volume: VolumeService,
    private snapshotService: SnapshotService,
    private isoService: IsoService,
    private templateService: TemplateService
  ) {}

  public getAvailablePrimaryStorage(): Observable<number> {
    return this.getAvailableStorage(ResourceType.PrimaryStorage)
      .map(size => size === -1 ? MAX_ROOT_DISK_SIZE_ADMIN : size);
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
    return Observable.forkJoin(
      this.snapshotService.getList(),
      this.isoService.getList({ filter: TemplateFilters.self }),
      this.templateService.getList({ filter: TemplateFilters.self })
    )
      .map(([snapshots, isos, templates]) => {
        let consumedSecondaryStorage = 0;
        snapshots.forEach((snapshot: Snapshot) => {
          consumedSecondaryStorage += snapshot.physicalSize || 0;
        });
        isos.forEach((iso: Iso) => {
          consumedSecondaryStorage += iso.size || 0;
        });
        templates.forEach((template: Template) => {
          consumedSecondaryStorage += template.size || 0;
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
    const limitRequest = this.resourceLimits.getList({ resourceType })
      .map(res => res[0].max);

    const consumedStorageRequest = this.getConsumedStorage(resourceType);

    return Observable.forkJoin([limitRequest, consumedStorageRequest])
      .map(values => {
        if (values[0] === -1) {
          return -1;
        }
        const space = values[0] - values[1];
        return space > 0 ? space : 0;
      })
      .catch(error => Observable.throw(error));
  }
}
