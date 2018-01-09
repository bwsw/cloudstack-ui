import { TestBed } from '@angular/core/testing';
import {
  CustomServiceOfferingService,
  DefaultServiceOfferingConfigurationByZone
} from './custom-service-offering.service';
import { ConfigService } from '../../../shared/services/config.service';
import { MockConfigService } from '../../../../testutils/mocks/model-services/services/mock-config.service.spec';
import {
  ResourceStats,
  ResourceUsageService
} from '../../../shared/services/resource-usage.service';
// tslint:disable-next-line
import { MockResourceUsageService } from '../../../../testutils/mocks/model-services/services/mock-resource-usage.service.spec';
import { ICustomOfferingRestrictionsByZone } from '../custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../custom-service-offering';
import * as isEqual from 'lodash/isEqual';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { MockEntityData } from '../../../../testutils/mocks/model-services/entity-data.spec';


interface CustomServiceOfferingFixture {
  restrictionsTests: {
    [example: string]: {
      config: {
        customOfferingRestrictions: ICustomOfferingRestrictionsByZone
      },
      serviceOffering?: ICustomServiceOffering;
      resources: ResourceStats,
      expected: ICustomOfferingRestrictionsByZone
    }
  },
  defaultParamsTests: {
    [example: string]: {
      config: {
        defaultServiceOfferingConfig: DefaultServiceOfferingConfigurationByZone,
        customOfferingRestrictions: ICustomOfferingRestrictionsByZone
      },
      resources: ResourceStats,
      expected?: ServiceOfferingFixture
    }
  }
}

interface ServiceOfferingFixture {
  id: string;
  cpunumber: number;
  cpuspeed: number;
  memory: number;
}

const fixture: CustomServiceOfferingFixture = require(
  './custom-service-offering.service.fixture.json');

describe('Custom service offering service', () => {
  let customServiceOfferingService: CustomServiceOfferingService;

  function configureTestBed(params?: {
    mockConfigServiceConfig?: {},
    mockResourceUsageServiceConfig?: {}
  }): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigService,
          useClass: MockConfigService
        },
        {
          provide: ResourceUsageService,
          useClass: MockResourceUsageService
        },
        {
          provide: 'mockConfigServiceConfig',
          useValue: { value: params.mockConfigServiceConfig }
        },
        {
          provide: 'mockResourceUsageServiceConfig',
          useValue: { value: params.mockResourceUsageServiceConfig }
        },
        CustomServiceOfferingService
      ]
    });
    customServiceOfferingService = TestBed.get(CustomServiceOfferingService);
  }

  function getOfferingRestrictionsByZoneForTest(key: string): ICustomOfferingRestrictionsByZone {
    const config = fixture.restrictionsTests[key].config;
    const resources = fixture.restrictionsTests[key].resources;

    configureTestBed({
      mockConfigServiceConfig: {},
      mockResourceUsageServiceConfig: {}
    });

    return customServiceOfferingService.getCustomOfferingRestrictionsByZoneSync(
      config.customOfferingRestrictions,
      resources
    );
  }

  function getCustomOfferingWithSetParamsForTest(
    key: string,
    serviceOffering?: ServiceOffering,
    zoneId?: string
  ): CustomServiceOffering {
    const _serviceOffering = serviceOffering || getCustomServiceOffering();
    const _zoneId = zoneId || 'zone1';

    const config = fixture.defaultParamsTests[key].config;
    const resources = fixture.defaultParamsTests[key].resources;

    configureTestBed({
      mockConfigServiceConfig: {},
      mockResourceUsageServiceConfig: {}
    });

    return customServiceOfferingService.getCustomOfferingWithSetParams(
      _serviceOffering,
      config.defaultServiceOfferingConfig[_zoneId]
      && config.defaultServiceOfferingConfig[_zoneId].customOfferingParams,
      config.customOfferingRestrictions[_zoneId],
      resources
    );
  }

  function getCustomServiceOffering(): ServiceOffering {
    const id = '3890f81e-62aa-4a50-971a-f066223d623d';
    return new MockEntityData().serviceOfferings.find(_ => _.id === id);
  }

  function areRestrictionsCorrect(
    key: string,
    restrictions: ICustomOfferingRestrictionsByZone
  ): boolean {
    return isEqual(restrictions, fixture.restrictionsTests[key].expected);
  }

  function isCustomOfferingCorrect(
    key: string,
    offering: CustomServiceOffering
  ): boolean {
    const expected = fixture.defaultParamsTests[key].expected;
    return (
      expected.cpunumber === offering.cpunumber
      && expected.cpuspeed === offering.cpuspeed
      && expected.memory === offering.memory
    );
  }

  it('should not modify restrictions if they are within resources', () => {
    const key = 'allParamsAreSpecifiedAndConformToRestrictions';
    const restrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
  });

  it('should limit restriction by currently used resources', () => {
    const key = 'limitsAreModifiedByResourceRestrictions';
    const restrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
  });

  it('should work for several zones', () => {
    const key = 'restrictionsWorkForSeveralZones';
    const restrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
  });

  it('should work for undefined restrictions', () => {
    const key = 'undefinedRestrictions';
    const restrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
  });

  it('should work for empty restrictions', () => {
    const key = 'emptyRestrictions';
    const restrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
  });

  it('should work for async restriction requests', done => {
    const key = 'restrictionsAsync';
    const config = fixture.restrictionsTests[key].config;
    const resources = fixture.restrictionsTests[key].resources;
    const resourceStats = <ResourceStats>{
      available: { cpus: 1, memory: 512 }
    };

    configureTestBed({
      mockConfigServiceConfig: config,
      mockResourceUsageServiceConfig: resources
    });

    return customServiceOfferingService.getCustomOfferingRestrictionsByZone(resourceStats)
      .subscribe(restrictions => {
        expect(areRestrictionsCorrect(key, restrictions)).toBeTruthy();
        done();
      });
  });

  it('should set custom offering params to default if restrictions are met', () => {
    const key = 'customOfferingWithParamsWithinRestrictions';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(isCustomOfferingCorrect(key, offering)).toBeTruthy();
  });

  it('should clip custom offering to resources', () => {
    const key = 'customOfferingIsClippedToResources';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(isCustomOfferingCorrect(key, offering)).toBeTruthy();
  });

  it('should fall back to restrictions if default params are not set', () => {
    const key = 'customOfferingFallsBackToRestrictionMinima';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(isCustomOfferingCorrect(key, offering)).toBeTruthy();
  });

  it('should fall back to hardcoded fallback params if restrictions are not set', () => {
    const key = 'customOfferingFallsBackToFallbackParams';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(isCustomOfferingCorrect(key, offering)).toBeTruthy();
  });

  it('should return undefined if restrictions are not compatible (by CPU)', () => {
    const key = 'returnUndefinedIfRestrictionsAreNotCompatibleByCPUs';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(offering).toBeUndefined();
  });

  it('should return undefined if restrictions are not compatible (by memory)', () => {
    const key = 'returnUndefinedIfRestrictionsAreNotCompatibleByMemory';
    const offering = getCustomOfferingWithSetParamsForTest(key);
    expect(offering).toBeUndefined();
  });
});
