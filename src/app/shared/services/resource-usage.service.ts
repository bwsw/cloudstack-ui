import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { BaseModel } from '../models/';
import { ResourceLimitService } from './resource-limit.service';
import { VmService } from '../../vm/vm.service';
import { VirtualMachine } from '../../vm/';
import { VolumeService } from './volume.service';
import { Volume } from '../models/volume.model';
import { SnapshotService } from "./snapshot.service";
import { Snapshot } from "../models/snapshot.model";
import { DiskStorageService } from "./root-disk-size.service";


class ResourcesData {
  public instances: number = 0;        // +
  public ips: number = 0;              // +
  public volumes: number = 0;          // +
  public snapshots: number = 0;        // +
// public templates: number = 0;        // unnecessary
// public projects: number = 0;         // unnecessary
// public networks: number = 0;         // unnecessary
// public vpcs: number = 0;             // unnecessary
  public cpus: number = 0;             // +
  public memory: number = 0;           // +
  public primaryStorage: number = 0;   // +
  public secondaryStorage: number = 0; // +
}

interface IResourceStats {
  consumed: ResourcesData;
  max: ResourcesData;
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

  public getAvailableResources(max: ResourcesData, consumed: ResourcesData): ResourcesData {
    let availableResources = new ResourcesData();
    for (let prop in max) {
      if (max.hasOwnProperty(prop)) {
        console.log(prop);
        availableResources[prop] = max[prop] - consumed[prop];
      }
    }
    return availableResources;
  }

  public getResourceUsage(): any {
    let consumedResources = new ResourcesData();
    let maxResources = new ResourcesData();

    let promiseArray = [];

    promiseArray.push(this.vmService.getList()
      .then((vms: Array<VirtualMachine>) => {
        consumedResources.instances = vms.length;
        vms.forEach((value, index, array) => {
          consumedResources.ips += value.nic.length;
          consumedResources.cpus += value.cpuNumber;
          consumedResources.memory += value.memory;
        });
        console.log(consumedResources);
      }));

    promiseArray.push(this.volumeService.getList()
      .then((volumes: Array<Volume>) => {
        consumedResources.volumes = volumes.length;
      }));

    promiseArray.push(this.snapshotService.getList()
      .then((snapshots: Array<Snapshot>) => {
        consumedResources.snapshots = snapshots.length;
      }));

    promiseArray.push(this.diskStorageService.getAvailablePrimaryStorage()
      .then(result => consumedResources.primaryStorage = result));
    promiseArray.push(this.diskStorageService.getAvailableSecondaryStorage()
      .then(result => consumedResources.secondaryStorage = result));

    return Promise.all(promiseArray)
      .then(result => {
        return this.resourceLimitService.getList().then(result => {
          maxResources.instances = result[0].max;           // add mapper to resource limit service
          maxResources.ips = result[1].max;                 // and remove this
          maxResources.volumes = result[2].max;             // stuff
          maxResources.snapshots = result[3].max;
          maxResources.cpus = result[8].max;
          maxResources.memory = result[9].max;
          maxResources.primaryStorage = result[10].max;
          maxResources.secondaryStorage = result[11].max;
          return {
            available: this.getAvailableResources(maxResources, consumedResources),
            consumed: consumedResources,
            max: maxResources
          }
        });
      });
  }
}
