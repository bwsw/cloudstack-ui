import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';
import { ServiceOffering } from '../models/service-offering.model';
import { Zone } from '../models/zone.model';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { OfferingAvailability } from './offering.service';
import { ResourcesData } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';

@Injectable()
class MockErrorService {
  public send(): void {
  }
}

describe('Service-offering service', () => {

  let serviceOfferingService: ServiceOfferingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceOfferingService,
        ConfigService,
        { provide: ErrorService, useClass: MockErrorService },
        { provide: CacheService, useClass: MockCacheService },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    serviceOfferingService = TestBed.get(ServiceOfferingService);
  });

  it('should check offering is available in zone', () => {
    let result = serviceOfferingService['isOfferingAvailableInZone'](
      new ServiceOffering({ id: '1' }),
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      new Zone({ id: '1' })
    );
    expect(result).toBe(false);

    result = serviceOfferingService['isOfferingAvailableInZone'](
      new ServiceOffering({ id: '1' }),
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1']
        }
      },
      new Zone({ id: '1' })
    );
    expect(result).toBe(true);

    result = serviceOfferingService['isOfferingAvailableInZone'](
      new ServiceOffering({ id: '1' }),
      <OfferingAvailability>{
        1: {
          filterOfferings: false,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      new Zone({ id: '1' })
    );
    expect(result).toBe(true);
  });
  it('should get available by resources without config settings', () => {
    const availableOfferings = [new ServiceOffering({ id: '1', isCustomized: true })];
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 1024;
    const result = serviceOfferingService.getAvailableByResourcesSync(
      availableOfferings,
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      undefined,
      resourceUsage,
      new Zone({ id: '1' })
    );
    expect(result).toEqual(availableOfferings);
  });

  it('should get available by resources', () => {
    const availableOfferings = [
      new ServiceOffering({ isCustomized: false, cpuNumber: 1, memory: 1 }),
      new ServiceOffering({ isCustomized: true })
    ];
    spyOn(serviceOfferingService, 'getOfferingsAvailableInZone')
      .and
      .returnValue(availableOfferings);
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    let result = serviceOfferingService.getAvailableByResourcesSync(
      [new ServiceOffering({ id: '1' })],
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      { '1': { cpuNumber: { min: 1 }, memory: { min: 1 } } },
      resourceUsage,
      new Zone({ id: '1' })
    );
    expect(result).toEqual([]);

    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;
    result = serviceOfferingService.getAvailableByResourcesSync(
      [new ServiceOffering({ id: '1' })],
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      { '1': { cpuNumber: { min: 1 }, memory: { min: 1 } } },
      resourceUsage,
      new Zone({ id: '1' })
    );
    expect(result).toEqual(availableOfferings);
  });
});
