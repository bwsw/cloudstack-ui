import { TestBed } from '@angular/core/testing';
import {
  CustomServiceOfferingService,
  DefaultServiceOfferingConfigurationByZone
} from './custom-service-offering.service';
import { ConfigService } from '../../../shared/services/config.service';
import { MockConfigService } from '../../../../testutils/mocks/model-services/services/mock-config.service.spec';
import { ResourceStats, ResourceUsageService } from '../../../shared/services/resource-usage.service';
import {
  MockResourceUsageService
} from '../../../../testutils/mocks/model-services/services/mock-resource-usage.service.spec';
import { ICustomOfferingRestrictionsByZone } from '../custom-offering-restrictions';
import { ICustomServiceOffering } from '../custom-service-offering';
import isEqual = require('lodash/isEqual');
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { MockEntityData } from '../../../../testutils/mocks/model-services/entity-data.spec';


interface CustomServiceOfferingFixture {
  [example: string]: {
    config: {
      defaultServiceOfferingConfig?: DefaultServiceOfferingConfigurationByZone,
      customOfferingRestrictions: ICustomOfferingRestrictionsByZone
    },
    serviceOffering?: ICustomServiceOffering;
    resources: ResourceStats,
    expected: ICustomOfferingRestrictionsByZone
  }
}

interface IServiceOffering {
  id: string;
}

const fixture: CustomServiceOfferingFixture = require('./custom-service-offering.service.fixture.json');

describe('Custom service offering service', () => {
  let customServiceOfferingService: CustomServiceOfferingService;

  function configureTestBed(params?: {
    mockConfigServiceConfig?: {},
    mockResourceUsageServiceConfig?: {}
  }): void {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: 'mockConfigServiceConfig', useValue: { value: params.mockConfigServiceConfig } },
        { provide: 'mockResourceUsageServiceConfig', useValue: { value: params.mockResourceUsageServiceConfig } },
        CustomServiceOfferingService
      ]
    });
    customServiceOfferingService = TestBed.get(CustomServiceOfferingService);
  }

  function getOfferingRestrictionsByZoneForTest(key: string): ICustomOfferingRestrictionsByZone {
    const config = fixture[key].config;
    const resources = fixture[key].resources;

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
    serviceOffering: ServiceOffering
  ): ICustomServiceOffering {
    const config = fixture[key].config;
    const resources = fixture[key].resources;

    configureTestBed({
      mockConfigServiceConfig: {},
      mockResourceUsageServiceConfig: {}
    });

    return customServiceOfferingService.getCustomOfferingWithSetParamsSync(
      serviceOffering,
      config.defaultServiceOfferingConfig,
      config.customOfferingRestrictions,
      resources
    );
  }

  function getRegularServiceOffering(): ServiceOffering {
    const id = '4fbec0f2-e03a-4135-8f0e-a13abca3c2e2';

    return new MockEntityData()
      .serviceOfferings
      .find(_ => {
        return _.id === id;
      });
  }

  function getCustomServiceOffering(): ServiceOffering {
    const id = '3890f81e-62aa-4a50-971a-f066223d623d';

    return new MockEntityData()
      .serviceOfferings
      .find(_ => {
        return _.id === id;
      });
  }

  it('should not modify restrictions if they are within resources', () => {
    const key = 'allParamsAreSpecifiedAndConformToRestrictions';
    const offeringRestrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(isEqual(offeringRestrictions, fixture[key].expected)).toBeTruthy();
  });

  it('should limit restriction by currently used resources', () => {
    const key = 'limitsAreModifiedByResourceRestrictions';
    const offeringRestrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(isEqual(offeringRestrictions, fixture[key].expected)).toBeTruthy();
  });

  it('should work for several zones', () => {
    const key = 'restrictionsWorkForSeveralZones';
    const offeringRestrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(isEqual(offeringRestrictions, fixture[key].expected)).toBeTruthy();
  });

  it('should work for undefined restrictions', () => {
    const key = 'undefinedRestrictions';
    const offeringRestrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(isEqual(offeringRestrictions, fixture[key].expected)).toBeTruthy();
  });

  it('should work for empty restrictions', () => {
    const key = 'emptyRestrictions';
    const offeringRestrictions = getOfferingRestrictionsByZoneForTest(key);
    expect(isEqual(offeringRestrictions, fixture[key].expected)).toBeTruthy();
  });

  it('should work for async restriction requests', done => {
    const key = 'restrictionsAsync';
    const config = fixture[key].config;
    const resources = fixture[key].resources;

    configureTestBed({
      mockConfigServiceConfig: config,
      mockResourceUsageServiceConfig: resources
    });

    return customServiceOfferingService.getCustomOfferingRestrictionsByZone()
      .subscribe(restrictions => {
        expect(isEqual(restrictions, fixture[key].expected)).toBeTruthy();
        done();
      });
  });

  xit('should set custom offering params to default if restrictions are met', () => {
    const key = 'customOfferingWithParamsWithinRestrictions';
    const serviceOffering = getCustomServiceOffering();

    const customOfferingWithSetParams = getCustomOfferingWithSetParamsForTest(key, serviceOffering);
    expect(isEqual(customOfferingWithSetParams, fixture[key].expected)).toBeTruthy();
  });
});
