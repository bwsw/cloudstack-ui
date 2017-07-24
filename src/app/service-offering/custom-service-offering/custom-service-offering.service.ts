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
    serviceOffering: CustomServiceOffering,
    defaultParams: ICustomServiceOffering,
    customRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): CustomServiceOffering {
    const cpuNumber =
      defaultParams && defaultParams.cpuNumber
      || customRestrictions && customRestrictions.memory && customRestrictions.memory.min
      || fallbackParams && fallbackParams.cpuNumber;

    const cpuSpeed =
      defaultParams && defaultParams.cpuSpeed
      || customRestrictions && customRestrictions.cpuSpeed && customRestrictions.cpuSpeed.min
      || fallbackParams && fallbackParams.cpuSpeed;

    const memory =
      defaultParams && defaultParams.memory
      || customRestrictions && customRestrictions.memory && customRestrictions.memory.min
      || fallbackParams && fallbackParams.memory;

    const restrictions = this.getRestrictionIntersection(
      customRestrictions,
      resourceStats
    );

    if (!this.restrictionsAreCompatible(restrictions)) {
      return undefined;
    }

    const normalizedParams = this.clipOfferingParamsToRestrictions(
      { cpuNumber, cpuSpeed, memory },
      customRestrictions
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
    customRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): CustomOfferingRestrictions {
    const result = {
      cpuNumber: {
        min: undefined,
        max: resourceStats.available.cpus
      },
      cpuSpeed: {
        min: undefined,
        max: undefined
      },
      memory: {
        min: undefined,
        max: resourceStats.available.memory
      }
    };

    if (customRestrictions.cpuNumber) {
      if (customRestrictions.cpuNumber.min) {
        result.cpuNumber.min = customRestrictions.cpuNumber.min;
      }

      if (customRestrictions.cpuNumber.max) {
        result.cpuNumber.max = Math.min(customRestrictions.cpuNumber.max, result.cpuNumber.max)
      }
    }

    if (customRestrictions.cpuSpeed) {
      if (customRestrictions.cpuSpeed.min) {
        result.cpuSpeed.min = customRestrictions.cpuSpeed.min;
      }

      if (customRestrictions.cpuSpeed.max) {
        result.cpuSpeed.max = Math.min(customRestrictions.cpuSpeed.max, result.cpuSpeed.max);
      }
    }

    if (customRestrictions.memory) {
      if (customRestrictions.memory.min) {
        result.memory.min = customRestrictions.memory.min;
      }

      if (customRestrictions.memory.max) {
        result.memory.max = Math.min(customRestrictions.memory.max, result.memory.max);
      }
    }

    return result;
  }

  private restrictionsAreCompatible(restrictions: CustomOfferingRestrictions): boolean {
    return (
      restrictions.cpuSpeed.min <= restrictions.cpuSpeed.max &&
      restrictions.cpuNumber.min <= restrictions.cpuNumber.max &&
      restrictions.memory.min <= restrictions.memory.max
    );
  }
}
