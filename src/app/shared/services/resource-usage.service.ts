import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResourceLimit, ResourceType } from '../models/resource-limit.model';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

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
    private authService: AuthService,
    private accountService: AccountService
  ) {
  }

  public getResourceUsage(forDomain = false): Observable<ResourceStats> {
    const params = forDomain
      ? { domainId: this.authService.user.domainid }
      : { account: this.authService.user.account };

    return this.accountService.getList(params).map(accounts => {
      const consumedResources = new ResourcesData();
      const maxResources = new ResourcesData();
      const availableResources = new ResourcesData();

      accounts.forEach(account => {
        consumedResources.instances += +account.vmtotal;
        consumedResources.cpus += +account.cputotal;
        consumedResources.ips += +account.iptotal;
        consumedResources.memory += +account.memorytotal;
        consumedResources.volumes += +account.volumetotal;
        consumedResources.snapshots += +account.snapshottotal;
        consumedResources.primaryStorage += +account.primarystoragetotal;
        consumedResources.secondaryStorage += +account.secondarystoragetotal;

        maxResources.instances += +account.vmlimit;
        maxResources.cpus += +account.cpulimit;
        maxResources.ips += +account.iplimit;
        maxResources.memory += +account.memorylimit;
        maxResources.volumes += +account.volumelimit;
        maxResources.snapshots += +account.snapshotlimit;
        maxResources.primaryStorage += +account.primarystoragelimit;
        maxResources.secondaryStorage += +account.secondarystoragelimit;

        availableResources.instances += +account.vmavailable;
        availableResources.cpus += +account.cpuavailable;
        availableResources.ips += +account.ipavailable;
        availableResources.memory += +account.memoryavailable;
        availableResources.volumes += +account.volumeavailable;
        availableResources.snapshots += +account.snapshotavailable;
        availableResources.primaryStorage += +account.primarystorageavailable;
        availableResources.secondaryStorage += +account.secondarystorageavailable;
      });

      return new ResourceStats(availableResources, consumedResources, maxResources);
    });
  }
}
