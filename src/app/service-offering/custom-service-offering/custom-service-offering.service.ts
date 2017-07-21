import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../../shared/models';
import { ConfigService, ResourceStats, ResourceUsageService } from '../../shared/services';
import {
  CustomOfferingRestrictions,
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from './custom-offering-restrictions';
import { CustomServiceOffering, ICustomServiceOffering } from './custom-service-offering';
import clone = require('lodash/clone');


export interface DefaultServiceOfferingConfigurationByZone {
  [zone: string]: DefaultServiceOfferingConfiguration;
}

export interface DefaultServiceOfferingConfiguration {
  offering: string;
  customOfferingParams: ICustomServiceOffering;
}

const fallbackParams = {
  cpuNumber: 1,
  cpuSpeed: 1000,
  memory: 512
};

@Injectable()
export class CustomServiceOfferingService {
  constructor(
    public configService: ConfigService,
    public resourceUsageService: ResourceUsageService
  ) {}

  public getCustomOfferingWithSetParams(
    offering: CustomServiceOffering,
    zone: Zone
  ): Observable<CustomServiceOffering> {
    const defaultConfigRequest =
      this.configService.get<DefaultServiceOfferingConfigurationByZone>('defaultServiceOfferingConfig');

    const customOfferingRestrictionsRequest =
      this.configService.get<ICustomOfferingRestrictions>('customOfferingRestrictions');

    const resourceUsageRequest = this.resourceUsageService.getResourceUsage();

    return Observable
      .forkJoin(
        defaultConfigRequest,
        customOfferingRestrictionsRequest,
        resourceUsageRequest
      )
      .map((
        [
          defaultParams,
          customOfferingRestrictions,
          resourceStats
        ]
      ) => {
        return this.getCustomOfferingWithSetParamsSync(
          offering,
          defaultParams[zone.id].customOfferingParams,
          customOfferingRestrictions,
          resourceStats
        );
      });
  }

  public getCustomOfferingRestrictionsByZone(
    customOfferingRestrictionsByZone: ICustomOfferingRestrictionsByZone,
    resourceStats: ResourceStats
  ): ICustomOfferingRestrictionsByZone {
    return Object.keys(customOfferingRestrictionsByZone)
      .reduce((acc, zone) => {
        return Object.assign(acc, {
          [zone]: this.getRestrictionIntersection(customOfferingRestrictionsByZone[zone], resourceStats)
        });
      }, {});
  }

  public getCustomOfferingWithSetParamsSync(
    serviceOffering:            CustomServiceOffering,
    defaultParams:              ICustomServiceOffering,
    customOfferingRestrictions: ICustomOfferingRestrictions,
    resourceStats:              ResourceStats
  ): CustomServiceOffering {
    const cpuNumber =
      defaultParams.cpuNumber
      || customOfferingRestrictions.memory.min
      || fallbackParams.cpuNumber;

    const cpuSpeed =
      defaultParams.cpuSpeed
      || customOfferingRestrictions.cpuSpeed.min
      || fallbackParams.cpuSpeed;

    const memory =
      defaultParams.memory
      || customOfferingRestrictions.memory.min
      || fallbackParams.memory;

    const restrictions = this.getRestrictionIntersection(
      customOfferingRestrictions,
      resourceStats
    );

    if (!this.restrictionsAreCompatible(restrictions)) {
      return undefined;
    }

    const normalizedParams = this.clipOfferingParamsToRestrictions(
      { cpuNumber, cpuSpeed, memory },
      customOfferingRestrictions
    );

    return new CustomServiceOffering({ ...normalizedParams, serviceOffering });
  }

  private clipOfferingParamsToRestrictions(
    offeringParams: ICustomServiceOffering,
    restrictions: ICustomOfferingRestrictions
  ): ICustomServiceOffering {
    let cpuNumber: number;
    let cpuSpeed:  number;
    let memory:    number;

    if (offeringParams.cpuNumber > restrictions.cpuNumber.max) {
      cpuNumber = restrictions.cpuNumber.max;
    } else if (offeringParams.cpuNumber < restrictions.cpuNumber.min) {
      cpuNumber = restrictions.cpuNumber.min;
    } else {
      cpuNumber = offeringParams.cpuNumber;
    }

    if (offeringParams.cpuSpeed > restrictions.cpuSpeed.max) {
      cpuSpeed = restrictions.cpuSpeed.max;
    } else if (offeringParams.cpuSpeed < restrictions.cpuSpeed.min) {
      cpuSpeed = restrictions.cpuSpeed.min;
    } else {
      cpuSpeed = offeringParams.cpuSpeed;
    }

    if (offeringParams.memory > restrictions.memory.max) {
      memory = restrictions.memory.max;
    } else if (offeringParams.memory < restrictions.memory.min) {
      memory = restrictions.memory.min;
    } else {
      memory = offeringParams.memory;
    }

    return { cpuNumber, cpuSpeed, memory };
  }

  private getRestrictionIntersection(
    customOfferingRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): CustomOfferingRestrictions {
    return {
      cpuNumber: {
        min: customOfferingRestrictions.cpuNumber.min,
        max: Math.min(customOfferingRestrictions.cpuNumber.max, resourceStats.available.cpus)
      },
      cpuSpeed: {
        min: customOfferingRestrictions.cpuSpeed.min,
        max: customOfferingRestrictions.cpuSpeed.max
      },
      memory: {
        min: customOfferingRestrictions.memory.min,
        max: Math.min(customOfferingRestrictions.memory.max, resourceStats.available.memory)
      }
    }
  }

  private restrictionsAreCompatible(restrictions: CustomOfferingRestrictions): boolean {
    return (
      restrictions.cpuSpeed.min <= restrictions.cpuSpeed.max &&
      restrictions.cpuNumber.min <= restrictions.cpuNumber.max &&
      restrictions.memory.min <= restrictions.memory.max
    );
  }
}
