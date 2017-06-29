import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { ResourceStats, ResourceUsageService } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../models';
import { OfferingAvailability } from './offering.service';


@Injectable()
export class ServiceOfferingFilterService {
  constructor(
    private resourceUsageService: ResourceUsageService,
    private serviceOfferingService: ServiceOfferingService
  ) { }

  public getAvailable(params?: any): Observable<Array<ServiceOffering>> {
    return Observable.forkJoin([
      this.serviceOfferingService.getList(params),
      this.resourceUsageService.getResourceUsage()
    ])
      .map(([serviceOfferings, resourceUsage]) => {
        return this.getAvailableByResources(serviceOfferings, resourceUsage)
          .sort((a: ServiceOffering, b: ServiceOffering) => {
            if (!a.isCustomized && b.isCustomized) { return -1; }
            if (a.isCustomized && !b.isCustomized) { return 1; }
            return 0;
          });
      });
  }

  public getAvailableSync(
    serviceOfferings: Array<ServiceOffering>,
    offeringAvailability: OfferingAvailability,
    resourceUsage: ResourceStats,
    zone: Zone
  ): Array<ServiceOffering> {
    const availableInZone = this.serviceOfferingService
      .getOfferingsAvailableInZone(
        serviceOfferings,
        offeringAvailability,
        zone
      );

    return this.getAvailableByResources(availableInZone, resourceUsage);
  }

  public getAvailableByResources(
    serviceOfferings: Array<ServiceOffering>,
    resourceUsage: ResourceStats
  ): Array<ServiceOffering> {
    return serviceOfferings
      .filter(offering => {
        if (offering.isCustomized) { return true; }

        const enoughCpus = resourceUsage.available.cpus >= offering.cpuNumber;
        const enoughMemory = resourceUsage.available.memory >= offering.memory;
        return enoughCpus && enoughMemory;
      });
  }
}
