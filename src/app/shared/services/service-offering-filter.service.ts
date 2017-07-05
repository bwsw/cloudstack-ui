import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  CustomOfferingRestrictions
} from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import { Zone } from '../models';
import { ServiceOffering } from '../models/service-offering.model';
import { ConfigService } from './';
import { OfferingAvailability } from './offering.service';
import { ResourceStats, ResourceUsageService } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';


@Injectable()
export class ServiceOfferingFilterService {
  constructor(
    private configService: ConfigService,
    private resourceUsageService: ResourceUsageService,
    private serviceOfferingService: ServiceOfferingService
  ) { }

  public getAvailableByResources(params: Partial<{ zone: Zone }>): Observable<Array<ServiceOffering>> {
    const availabilityRequest: Observable<OfferingAvailability> = this.configService.get('offeringAvailability');
    const restrictionsRequest: Observable<CustomOfferingRestrictions> =
      this.configService.get('customOfferingRestrictions');

    return Observable.forkJoin([
      this.serviceOfferingService.getList(params),
      availabilityRequest,
      restrictionsRequest,
      this.resourceUsageService.getResourceUsage()
    ])
      .map((
        [
          serviceOfferings,
          offeringAvailability,
          offeringRestrictions,
          resourceUsage
        ]
      ) => {
        return this.serviceOfferingService.getAvailableByResourcesSync(
          serviceOfferings,
          offeringAvailability,
          offeringRestrictions,
          resourceUsage,
          params.zone
        )
          .sort((a: ServiceOffering, b: ServiceOffering) => {
            if (!a.isCustomized && b.isCustomized) { return -1; }
            if (a.isCustomized && !b.isCustomized) { return 1; }
            return 0;
          });
      });
  }
}
