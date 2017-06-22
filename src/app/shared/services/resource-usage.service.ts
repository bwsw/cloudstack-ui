import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../../vm/';
import { VmService } from '../../vm/shared/vm.service';
import { ResourceLimit, ResourceType } from '../models/resource-limit.model';
import { Snapshot } from '../models/snapshot.model';
import { Volume } from '../models/volume.model';
import { DiskStorageService } from './disk-storage.service';
import { ResourceLimitService } from './resource-limit.service';
import { SnapshotService } from './snapshot.service';
import { VolumeService } from './volume.service';


export class ResourcesData {
  public instances = 0;
  public ips = 0;
  public volumes = 0;
  public snapshots = 0;
  public cpus = 0;
  public memory = 0;
  public primaryStorage = 0;
  public secondaryStorage = 0;

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
    max?: ResourcesData,
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

  public getResourceUsage(): Observable<ResourceStats> {
    let consumedResources = new ResourcesData();
    let maxResources;

    let requests = [];

    requests.push(
      this.vmService.getList().map((vms: Array<VirtualMachine>) => {
        consumedResources.instances = vms.length;
        vms.forEach(value => {
          consumedResources.ips += value.nic.length;
          consumedResources.cpus += value.cpuNumber;
          consumedResources.memory += value.memory;
        });
      })
    );

    requests.push(
      this.volumeService.getList().map((volumes: Array<Volume>) => {
        consumedResources.volumes = volumes.length;
      })
    );

    requests.push(
      this.snapshotService.getList().map((snapshots: Array<Snapshot>) => {
        consumedResources.snapshots = snapshots.length;
      })
    );

    requests.push(
      this.diskStorageService
        .getConsumedPrimaryStorage()
        .map(result => consumedResources.primaryStorage = result)
    );

    requests.push(
      this.diskStorageService
        .getConsumedSecondaryStorage()
        .map(result => consumedResources.secondaryStorage = result)
    );

    return Observable.forkJoin(requests)
      .switchMap(() => this.resourceLimitService.getList())
      .map(result => {
        maxResources = new ResourcesData(result);
        return new ResourceStats(
          this.getAvailableResources(maxResources, consumedResources),
          consumedResources,
          maxResources
        );
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
