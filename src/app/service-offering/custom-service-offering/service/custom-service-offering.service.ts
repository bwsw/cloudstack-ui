import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/services/config.service';
import {
  ResourceStats,
  ResourceUsageService
} from '../../../shared/services/resource-usage.service';
import {
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../custom-service-offering';


export interface DefaultServiceOfferingConfigurationByZone {
  [zone: string]: DefaultServiceOfferingConfiguration;
}

export interface DefaultServiceOfferingConfiguration {
  offering: string;
  customOfferingParams: CustomServiceOffering;
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
  ) {
  }

  public getCustomOfferingWithSetParams(
    serviceOffering: CustomServiceOffering,
    defaultParams: ICustomServiceOffering,
    customRestrictions: ICustomOfferingRestrictions,
    resourceStats: ResourceStats
  ): CustomServiceOffering {
    const cpunumber =
      serviceOffering.cpunumber
      || defaultParams && defaultParams.cpunumber
      || customRestrictions && customRestrictions.cpuNumber && customRestrictions.cpuNumber.min
      || customServiceOfferingFallbackParams.cpuNumber;

    const cpuspeed =
      serviceOffering.cpuspeed
      || defaultParams && defaultParams.cpuspeed
      || customRestrictions && customRestrictions.cpuSpeed && customRestrictions.cpuSpeed.min
      || customServiceOfferingFallbackParams.cpuSpeed;

    const memory =
      serviceOffering.memory
      || defaultParams && defaultParams.memory
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
      { cpunumber, cpuspeed, memory },
      restrictions
    );

    return Object.assign(serviceOffering, { ...normalizedParams });
  }

  public getCustomOfferingRestrictionsByZone(
    resourceStats: ResourceStats
  ): Observable<ICustomOfferingRestrictionsByZone> {
    const restrictions = this.configService.get<ICustomOfferingRestrictionsByZone>(
      'customOfferingRestrictions');

    return Observable.of(this.getCustomOfferingRestrictionsByZoneSync(
      restrictions,
      resourceStats
    ));
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
        });
      }, {});
  }

  private clipOfferingParamsToRestrictions(
    offeringParams: ICustomServiceOffering,
    restrictions: ICustomOfferingRestrictions
  ): ICustomServiceOffering {
    return Object.keys(offeringParams).reduce((acc, key) => {
      if (!restrictions[key]) {
        return Object.assign(acc, { [key]: offeringParams[key] });
      }

      if (offeringParams[key] > restrictions[key].max) {
        return Object.assign(acc, { [key]: restrictions[key].max });
      }

      if (offeringParams[key] < restrictions[key].min) {
        return Object.assign(acc, { [key]: restrictions[key].min });
      }

      return Object.assign(acc, { [key]: offeringParams[key] });
    }, {});
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
        result.cpuNumber['max'] = Math.min(
          customRestrictions.cpuNumber.max,
          result.cpuNumber.max
        );
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
    return Object.keys(restrictions).reduce((acc, key) => {
      return (
        acc &&
        (restrictions[key] == null ||
          restrictions[key].min == null ||
          restrictions[key].max == null ||
          restrictions[key].min < restrictions[key].max)
      );
    }, true);
  }
}
