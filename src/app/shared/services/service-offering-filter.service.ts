import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { ResourceUsageService } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';


@Injectable()
export class ServiceOfferingFilterService {

  constructor(
    private resourceUsageService: ResourceUsageService,
    private serviceOfferingService: ServiceOfferingService
  ) {}

  public getAvailable(): Promise<Array<ServiceOffering>> {
    return Promise.all([
      this.serviceOfferingService.getList(),
      this.resourceUsageService.getResourceUsage()
    ]).then(([serviceOfferings, resourceUsage]) => {
      let sos = serviceOfferings.filter(elem => {
        return resourceUsage.available.cpus >= elem.cpuNumber &&
          resourceUsage.available.memory >= elem.memory;
      });
      if (sos.length) {
        return sos;
      }
      throw new Error();
    });
  }
}
