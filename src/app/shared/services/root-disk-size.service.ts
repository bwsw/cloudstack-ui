import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ResourceLimitService } from './resource-limit.service';
import { VolumeService } from './volume.service';
import { Volume } from '../models/volume.model';
import { ResourceType } from '../models/resource-limit.model';


@Injectable()
export class RootDiskSizeService {
  constructor(private resourceLimits: ResourceLimitService, private volume: VolumeService) {}

  public getAvailableRootDiskSize(): Promise<number> {
    let limitRequest = this.resourceLimits.getList({ 'resourcetype': ResourceType.PrimaryStorage })
      .then(res => res[0].max);

    let volumeRequest = this.volume.getList()
      .then(res => {
        return res.reduce((accum: number, current: Volume) => {
          return accum + +current.size;
        }, 0);
      });

    return Promise.all([limitRequest, volumeRequest])
      .then(values => {
        let space = values[0] * Math.pow(2, 30) - values[1];
        return space > 0 ? Math.floor(space / Math.pow(2, 30)) : 0;
      })
      .catch(error => Promise.reject(error));
  }
}
