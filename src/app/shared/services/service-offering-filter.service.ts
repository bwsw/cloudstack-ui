import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { ResourceStats, ResourceUsageService } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../models';
import { OfferingAvailability } from './offering.service';
import { CustomOfferingRestrictions } from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import { ConfigService } from './';


@Injectable()
export class ServiceOfferingFilterService {
  constructor(
    private configService: ConfigService,
    private resourceUsageService: ResourceUsageService,
    private serviceOfferingService: ServiceOfferingService
  ) { }

  public getAvailableByZoneAndResources(params?: any): Observable<Array<ServiceOffering>> {
    const offeringRestrictionsRequest: Observable<CustomOfferingRestrictions> =
      this.configService.get('customOfferingRestrictions');

    return Observable.forkJoin([
      this.serviceOfferingService.getList(params),
      offeringRestrictionsRequest,
      this.resourceUsageService.getResourceUsage()
    ])
      .map(([serviceOfferings, offeringRestrictions, resourceUsage]) => {
        return this.getAvailableByResources(serviceOfferings, offeringRestrictions, resourceUsage)
          .sort((a: ServiceOffering, b: ServiceOffering) => {
            if (!a.isCustomized && b.isCustomized) { return -1; }
            if (a.isCustomized && !b.isCustomized) { return 1; }
            return 0;
          });
      });
  }

  public getAvailableByZoneAndResourcesSync(
    serviceOfferings: Array<ServiceOffering>,
    offeringAvailability: OfferingAvailability,
    offeringRestrictions: CustomOfferingRestrictions,
    resourceUsage: ResourceStats,
    zone: Zone
  ): Array<ServiceOffering> {
    const availableInZone = this.serviceOfferingService
      .getOfferingsAvailableInZone(
        serviceOfferings,
        offeringAvailability,
        zone
      );

    return this.getAvailableByResources(availableInZone, offeringRestrictions, resourceUsage);
  }

  public getAvailableByResources(
    serviceOfferings: Array<ServiceOffering>,
    offeringRestriction: CustomOfferingRestrictions,
    resourceUsage: ResourceStats
  ): Array<ServiceOffering> {
    return serviceOfferings
      .filter(offering => {
        if (offering.isCustomized) {
          const enoughCpus = offeringRestriction.cpuNumber.min < resourceUsage.available.cpus;
          const enoughMemory = offeringRestriction.memory.min < resourceUsage.available.memory;
          return enoughCpus && enoughMemory;
        } else {
          const enoughCpus = resourceUsage.available.cpus >= offering.cpuNumber;
          const enoughMemory = resourceUsage.available.memory >= offering.memory;
          return enoughCpus && enoughMemory;
        }
      });
  }
}
