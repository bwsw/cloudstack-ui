import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService, ResourceStats, ResourceUsageService } from '../../../shared/services';
import {
  CustomOfferingRestrictions,
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../custom-offering-restrictions';
import { CustomServiceOffering, ICustomServiceOffering } from '../custom-service-offering';


export interface DefaultServiceOfferingConfigurationByZone {
  [zone: string]: DefaultServiceOfferingConfiguration;
}

export interface DefaultServiceOfferingConfiguration {
  offering: string;
  customOfferingParams: ICustomServiceOffering;
}

export const customServiceOfferingFallbackParams = {
  cpuNumber: 1,
  cpuSpeed: 1000,
  memory: 512
};

@Injectable()
export class CustomServiceOfferingService {
  constructor(
    private configService: ConfigService,
    private resourceUsageService: ResourceUsageService
  ) {}

  public getCustomOfferingWithSetParams(
    offering: CustomServiceOffering,
    zoneId: string
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
          defaultParams[zoneId].customOfferingParams,
          customOfferingRestrictions[zoneId],
          resourceStats
        );
      });
  }

  public getCustomOfferingWithSetParamsSync(
    serviceOffering: CustomServiceOffering,
    defaultParams: ICustomServiceOffering,
    customRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): CustomServiceOffering {
    const cpuNumber =
      defaultParams && defaultParams.cpuNumber
      || customRestrictions && customRestrictions.cpuNumber && customRestrictions.cpuNumber.min
      || customServiceOfferingFallbackParams.cpuNumber;

    const cpuSpeed =
      defaultParams && defaultParams.cpuSpeed
      || customRestrictions && customRestrictions.cpuSpeed && customRestrictions.cpuSpeed.min
      || customServiceOfferingFallbackParams.cpuSpeed;

    const memory =
      defaultParams && defaultParams.memory
      || customRestrictions && customRestrictions.memory && customRestrictions.memory.min
      || customServiceOfferingFallbackParams.memory;

    const restrictions = this.getRestrictionIntersection(
      customRestrictions,
      resourceStats
    );

    if (!this.restrictionsAreCompatible(restrictions)) {
      return undefined;
    }

    const normalizedParams = this.clipOfferingParamsToRestrictions(
      { cpuNumber, cpuSpeed, memory },
      restrictions
    );

    return new CustomServiceOffering({ ...normalizedParams, serviceOffering });
  }

  public getCustomOfferingRestrictionsByZone(): Observable<ICustomOfferingRestrictionsByZone> {
    const restrictionsRequest = this.configService.get<ICustomOfferingRestrictionsByZone>('customOfferingRestrictions');
    const resourceStatsRequest = this.resourceUsageService.getResourceUsage();

    return Observable.forkJoin(
      restrictionsRequest,
      resourceStatsRequest
    )
      .map(([restrictions, resourceStats]) => {
        return this.getCustomOfferingRestrictionsByZoneSync(
          restrictions,
          resourceStats
        )
      });
  }

  public getCustomOfferingRestrictionsByZoneSync(
    customOfferingRestrictionsByZone: ICustomOfferingRestrictionsByZone = {},
    resourceStats: ResourceStats
  ): ICustomOfferingRestrictionsByZone {
    return Object.keys(customOfferingRestrictionsByZone)
      .reduce((acc, zone) => {
        return Object.assign(acc, {
          [zone]: this.getRestrictionIntersection(
            customOfferingRestrictionsByZone[zone],
            resourceStats
          )
        })
      }, {});
  }

  private clipOfferingParamsToRestrictions(
    offeringParams: ICustomServiceOffering,
    restrictions: ICustomOfferingRestrictions
  ): ICustomServiceOffering {
    if (!restrictions) {
      return offeringParams;
    }

    let cpuNumber: number;
    let cpuSpeed:  number;
    let memory:    number;

    if (restrictions.cpuNumber) {
      if (offeringParams.cpuNumber > restrictions.cpuNumber.max) {
        cpuNumber = restrictions.cpuNumber.max;
      } else if (offeringParams.cpuNumber < restrictions.cpuNumber.min) {
        cpuNumber = restrictions.cpuNumber.min;
      } else {
        cpuNumber = offeringParams.cpuNumber;
      }
    } else {
      cpuNumber = offeringParams.cpuNumber;
    }

    if (restrictions.cpuSpeed) {
      if (offeringParams.cpuSpeed > restrictions.cpuSpeed.max) {
        cpuSpeed = restrictions.cpuSpeed.max;
      } else if (offeringParams.cpuSpeed < restrictions.cpuSpeed.min) {
        cpuSpeed = restrictions.cpuSpeed.min;
      } else {
        cpuSpeed = offeringParams.cpuSpeed;
      }
    } else {
      cpuSpeed = offeringParams.cpuSpeed;
    }

    if (restrictions.memory) {
      if (offeringParams.memory > restrictions.memory.max) {
        memory = restrictions.memory.max;
      } else if (offeringParams.memory < restrictions.memory.min) {
        memory = restrictions.memory.min;
      } else {
        memory = offeringParams.memory;
      }
    } else {
      memory = offeringParams.memory;
    }

    return { cpuNumber, cpuSpeed, memory };
  }

  private getRestrictionIntersection(
    customRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): ICustomOfferingRestrictions {
    const result = {
      cpuNumber: {
        max: resourceStats.available.cpus
      },
      memory: {
        max: resourceStats.available.memory
      }
    };

    if (customRestrictions == null) {
      return result;
    }

    if (customRestrictions.cpuNumber != null) {
      if (customRestrictions.cpuNumber.min != null) {
        result.cpuNumber['min'] = customRestrictions.cpuNumber.min;
      }

      if (customRestrictions.cpuNumber.max != null) {
        result.cpuNumber['max'] = Math.min(customRestrictions.cpuNumber.max, result.cpuNumber.max)
      }
    }

    if (customRestrictions.cpuSpeed != null) {
      if (customRestrictions.cpuSpeed.min != null) {
        if (!result['cpuSpeed']) {
          result['cpuSpeed'] = {};
        }

        result['cpuSpeed']['min'] = customRestrictions.cpuSpeed.min;
      }

      if (customRestrictions.cpuSpeed.max != null) {
        if (!result['cpuSpeed']) {
          result['cpuSpeed'] = {};
        }

        result['cpuSpeed']['max'] = customRestrictions.cpuSpeed.max;
      }
    }

    if (customRestrictions.memory != null) {
      if (customRestrictions.memory.min != null) {
        result.memory['min'] = customRestrictions.memory.min;
      }

      if (customRestrictions.memory.max != null) {
        result.memory['max'] = Math.min(customRestrictions.memory.max, result.memory.max);
      }
    }

    return result;
  }

  private restrictionsAreCompatible(restrictions: ICustomOfferingRestrictions): boolean {
    return (
      (restrictions.cpuSpeed == null
        || restrictions.cpuSpeed.min == null
        || restrictions.cpuSpeed.max == null
        || restrictions.cpuSpeed.min <= restrictions.cpuSpeed.max
      )
      && (restrictions.cpuNumber == null
        || restrictions.cpuNumber.min == null
        || restrictions.cpuNumber.max == null
        || restrictions.cpuNumber.min <= restrictions.cpuNumber.max
      )
      && (restrictions.memory == null
        || restrictions.memory.min == null
        || restrictions.memory.max == null
        || restrictions.memory.min <= restrictions.memory.max
      )
    );
  }
}
