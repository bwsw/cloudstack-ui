import { Injectable } from '@angular/core';
import {
  DefaultCustomServiceOfferingRestrictions,
  ICustomOfferingRestrictionsByZone,
  ServiceOffering,
  Zone
} from '../models';
import { BackendResource } from '../decorators';
import { OfferingAvailability, OfferingService } from './offering.service';
import { ResourceStats } from './resource-usage.service';
import * as merge from 'lodash/merge';


@Injectable()
@BackendResource({
  entity: 'ServiceOffering'
})
export class ServiceOfferingService extends OfferingService<ServiceOffering> {
  public getAvailableByResourcesSync(
    serviceOfferings: Array<ServiceOffering>,
    offeringAvailability: OfferingAvailability,
    offeringRestrictions: ICustomOfferingRestrictionsByZone,
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

        if (offering.iscustomized) {
          const restrictions = merge(
            DefaultCustomServiceOfferingRestrictions,
            offeringRestrictions && offeringRestrictions[zone.id]
          );
          enoughCpus = !restrictions.cpuNumber || restrictions.cpuNumber.min < resourceUsage.available.cpus;
          enoughMemory = !restrictions.memory || restrictions.memory.min < resourceUsage.available.memory;
        } else {
          enoughCpus = resourceUsage.available.cpus >= offering.cpunumber;
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
    return availability[zone.id].serviceOfferings.indexOf(offering.id) !== -1;
  }
}
