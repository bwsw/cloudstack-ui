import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { ResourceLimitService } from './resource-limit.service';
import { VmService } from '../../vm/vm.service';
import { VirtualMachine } from '../../vm/';
import { VolumeService } from './volume.service';
import { Volume } from '../models/volume.model';
import { SnapshotService } from './snapshot.service';
import { Snapshot } from '../models/snapshot.model';
import { DiskStorageService } from './disk-storage.service';
import { ResourceType, ResourceLimit } from '../models/resource-limit.model';


export class ResourcesData {
  public instances: number = 0;
  public ips: number = 0;
  public volumes: number = 0;
  public snapshots: number = 0;
  public cpus: number = 0;
  public memory: number = 0;
  public primaryStorage: number = 0;
  public secondaryStorage: number = 0;

  constructor(resources?: Array<ResourceLimit>) {
    if (resources) {
      this.instances = resources[ResourceType.Instance].max;
      this.ips = resources[ResourceType.IP].max;
      this.volumes = resources[ResourceType.Volume].max;
      this.snapshots = resources[ResourceType.Snapshot].max;
      this.cpus = resources[ResourceType.CPU].max;
      this.memory = resources[ResourceType.Memory].max;
      this.primaryStorage = resources[ResourceType.PrimaryStorage].max;
      this.secondaryStorage = resources[ResourceType.SecondaryStorage].max;
    }
  }
}

export class ResourceStats {
  public available: ResourcesData;
  public consumed: ResourcesData;
  public max: ResourcesData;

  constructor(
    available?: ResourcesData,
    consumed?: ResourcesData,
    max?: ResourcesData
  ) {
    this.available = available || new ResourcesData();
    this.consumed = consumed || new ResourcesData();
    this.max = max || new ResourcesData();
  }
}

@Injectable()
export class ResourceUsageService {
  constructor(
    private resourceLimitService: ResourceLimitService,
    private vmService: VmService,
    private volumeService: VolumeService,
    private snapshotService: SnapshotService,
    private diskStorageService: DiskStorageService
  ) {}

  public getResourceUsage(): Promise<ResourceStats> {
    let consumedResources = new ResourcesData();
    let maxResources;

    let promiseArray = [];

    promiseArray.push(this.vmService.getList()
      .then((vms: Array<VirtualMachine>) => {
        consumedResources.instances = vms.length;
        vms.forEach((value, index, array) => {
          consumedResources.ips += value.nic.length;
          consumedResources.cpus += value.cpuNumber;
          consumedResources.memory += value.memory;
        });
      }));

    promiseArray.push(this.volumeService.getList()
      .then((volumes: Array<Volume>) => {
        consumedResources.volumes = volumes.length;
      }));

    promiseArray.push(this.snapshotService.getList()
      .then((snapshots: Array<Snapshot>) => {
        consumedResources.snapshots = snapshots.length;
      }));

    promiseArray.push(this.diskStorageService.getConsumedPrimaryStorage()
      .then(result => consumedResources.primaryStorage = result));

    promiseArray.push(this.diskStorageService.getConsumedSecondaryStorage()
      .then(result => consumedResources.secondaryStorage = result));

    return Promise.all(promiseArray)
      .then(() => {
        return this.resourceLimitService.getList().then(result => {
          maxResources = new ResourcesData(result);
          return new ResourceStats(
            this.getAvailableResources(maxResources, consumedResources),
            consumedResources,
            maxResources
          );
        });
      });
  }

  private getAvailableResources(max: ResourcesData, consumed: ResourcesData): ResourcesData {
    let availableResources = new ResourcesData();
    for (let prop in max) {
      if (max.hasOwnProperty(prop)) {
        if (max[prop] === -1) {
          availableResources[prop] = Number.MAX_SAFE_INTEGER;
        } else {
          availableResources[prop] = max[prop] - consumed[prop];
        }
      }
    }
    return availableResources;
  }
}
