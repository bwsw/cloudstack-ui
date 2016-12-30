import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ResourceLimitService } from './resource-limit.service';
import { VolumeService } from './volume.service';
import { Volume } from '../models/volume.model';
import { ResourceType } from '../models/resource-limit.model';


@Injectable()
export class DiskStorageService {
  constructor(private resourceLimits: ResourceLimitService, private volume: VolumeService) {}

  public getAvailablePrimaryStorage(): Promise<number> {
    return this.getAvailableStorage(ResourceType.PrimaryStorage);
  }

  public getAvailableSecondaryStorage(): Promise<number> {
    return this.getAvailableStorage(ResourceType.SecondaryStorage);
  }

  public getConsumedPrimaryStorage(): Promise<number> {
    return this.getConsumedStorage(ResourceType.PrimaryStorage);
  }

  public getConsumedSecondaryStorage(): Promise<number> {
    return this.getConsumedStorage(ResourceType.SecondaryStorage);
  }

  private getAvailableStorage(resourceType: number): Promise<number> {
    let limitRequest = this.resourceLimits.getList({ 'resourcetype': resourceType })
      .then(res => res[0].max);

    let consumedStorageRequest = this.getConsumedStorage(resourceType);

    return Promise.all([limitRequest, consumedStorageRequest])
      .then(values => {
        let space = Math.floor(values[0] / Math.pow(2, 30)) - values[1];
          return space > 0 ? space : 0;
        })
      .catch(error => Promise.reject(error));
  }

  private getConsumedStorage(resourceType: number): Promise<number> {
    return this.volume.getList()
      .then(res => {
        return res.reduce((accum: number, current: Volume) => {
          return Math.floor(accum + +current.size / Math.pow(2, 30));
        }, 0);
      });
  }
}
