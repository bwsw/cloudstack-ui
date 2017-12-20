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
  cpunumber: 1,
  cpuspeed: 1000,
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
      || customRestrictions && customRestrictions.cpunumber && customRestrictions.cpunumber.min
      || customServiceOfferingFallbackParams.cpunumber;

    const cpuspeed =
      serviceOffering.cpuspeed
      || defaultParams && defaultParams.cpuspeed
      || customRestrictions && customRestrictions.cpuspeed && customRestrictions.cpuspeed.min
      || customServiceOfferingFallbackParams.cpuspeed;

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

    return { ...serviceOffering, ...normalizedParams };
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
      cpunumber: {
        max: resourceStats.available.cpus
      },
      memory: {
        max: resourceStats.available.memory
      }
    };

    if (customRestrictions == null) {
      return result;
    }

    if (customRestrictions.cpunumber != null) {
      if (customRestrictions.cpunumber.min != null) {
        result.cpunumber['min'] = customRestrictions.cpunumber.min;
      }

      if (customRestrictions.cpunumber.max != null) {
        result.cpunumber['max'] = Math.min(
          customRestrictions.cpunumber.max,
          result.cpunumber.max
        );
      }
    }

    if (customRestrictions.cpuspeed != null) {
      if (customRestrictions.cpuspeed.min != null) {
        if (!result['cpuspeed']) {
          result['cpuspeed'] = {};
        }

        result['cpuspeed']['min'] = customRestrictions.cpuspeed.min;
      }

      if (customRestrictions.cpuspeed.max != null) {
        if (!result['cpuspeed']) {
          result['cpuspeed'] = {};
        }

        result['cpuspeed']['max'] = customRestrictions.cpuspeed.max;
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
