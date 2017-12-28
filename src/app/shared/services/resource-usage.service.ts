import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ResourceLimit,
  ResourceType,
  Account
} from '../models';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

export class ResourcesData {
  public instances = 0;
  public volumes = 0;
  public cpus = 0;
  public memory = 0;
  public primaryStorage = 0;

  public snapshots = 0;
  public ips = 0;
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

  public static fromAccount(accounts: Array<Account>): ResourceStats {
    const consumedResources = new ResourcesData();
    const maxResources = new ResourcesData();
    const availableResources = new ResourcesData();

    accounts.forEach(a => {
      consumedResources.instances += +a.vmtotal;
      consumedResources.cpus += +a.cputotal;
      consumedResources.ips += +a.iptotal;
      consumedResources.memory += +a.memorytotal;
      consumedResources.volumes += +a.volumetotal;
      consumedResources.snapshots += +a.snapshottotal;
      consumedResources.primaryStorage += +a.primarystoragetotal;
      consumedResources.secondaryStorage += +a.secondarystoragetotal;

      maxResources.instances += +a.vmlimit;
      maxResources.cpus += +a.cpulimit;
      maxResources.ips += +a.iplimit;
      maxResources.memory += +a.memorylimit;
      maxResources.volumes += +a.volumelimit;
      maxResources.snapshots += +a.snapshotlimit;
      maxResources.primaryStorage += +a.primarystoragelimit;
      maxResources.secondaryStorage += +a.secondarystoragelimit;

      availableResources.instances += +a.vmavailable;
      availableResources.cpus += +a.cpuavailable;
      availableResources.ips += +a.ipavailable;
      availableResources.memory += +a.memoryavailable;
      availableResources.volumes += +a.volumeavailable;
      availableResources.snapshots += +a.snapshotavailable;
      availableResources.primaryStorage += +a.primarystorageavailable;
      availableResources.secondaryStorage += +a.secondarystorageavailable;
    });

    return new ResourceStats(availableResources, consumedResources, maxResources);
  }

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
  ) {}

  public getResourceUsage(forDomain = false): Observable<ResourceStats> {
    const params = forDomain
      ? { domainId: this.authService.user.domainid }
      : { account: this.authService.user.account };

    return this.accountService
      .getList(params)
      .map(accounts => ResourceStats.fromAccount(accounts));
  }
}
