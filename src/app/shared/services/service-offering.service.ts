import { Injectable } from '@angular/core';
import { ICustomOfferingRestrictions } from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import { DefaultServiceOfferingConfigurationByZone } from '../../service-offering/custom-service-offering/custom-service-offering.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ServiceOffering } from '../models/service-offering.model';
import { Zone } from '../models/zone.model';
import { OfferingAvailability, OfferingService } from './offering.service';
import { ResourceStats } from './resource-usage.service';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering',
  entityModel: ServiceOffering
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  public getDefaultServiceOffering(
    offerings: Array<ServiceOffering>,
    configuration: DefaultServiceOfferingConfigurationByZone,
    zone: Zone
  ): ServiceOffering {
    const defaultOfferingId = configuration[zone.id].offering;
    return offerings.find(_ => _.id === defaultOfferingId);
  }

  public getAvailableByResourcesSync(
    serviceOfferings: Array<ServiceOffering>,
    offeringAvailability: OfferingAvailability,
    offeringRestrictions: ICustomOfferingRestrictions,
    resourceUsage: ResourceStats,
    zone: Zone
  ): Array<ServiceOffering> {
    const availableInZone = this
      .getOfferingsAvailableInZone(
        serviceOfferings,
        offeringAvailability,
        zone
      );

    return availableInZone
      .filter(offering => {
        let enoughCpus;
        let enoughMemory;

        if (offering.isCustomized) {
          enoughCpus = offeringRestrictions[zone.id].cpuNumber.min < resourceUsage.available.cpus;
          enoughMemory = offeringRestrictions[zone.id].memory.min < resourceUsage.available.memory;
        } else {
          enoughCpus = resourceUsage.available.cpus >= offering.cpuNumber;
          enoughMemory = resourceUsage.available.memory >= offering.memory;
        }

        return enoughCpus && enoughMemory;
      });
  }

  protected isOfferingAvailableInZone(
    offering: ServiceOffering,
    availability: OfferingAvailability,
    zone: Zone
  ): boolean {
    if (!availability[zone.id] || !availability[zone.id].filterOfferings) {
      return true;
    }
    return availability[zone.id].serviceOfferings.includes(offering.id);
  }
}
