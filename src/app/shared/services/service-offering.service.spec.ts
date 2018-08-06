import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';
import { StorageTypes } from '../models/offering.model';
import { ServiceOffering } from '../models/service-offering.model';
import { Zone } from '../models/zone.model';
import { CacheService } from './cache.service';
import { ConfigService } from '../../core/services';
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
  const newSO = <ServiceOffering>{
    id: '1',
    name: 'Service Offering',
    displaytext: 'About disk offering',
    diskBytesReadRate: 1,
    diskBytesWriteRate: 1,
    diskIopsReadRate: 1,
    diskIopsWriteRate: 1,
    iscustomized: false,
    miniops: 1,
    maxiops: 1,
    storagetype: StorageTypes.local,
    provisioningtype: '',
    created: new Date().toDateString(),
    cpunumber: 1,
    cpuspeed: 1000,
    memory: 512,
    networkrate: '',
    offerha: false,
    limitcpuuse: false,
    isvolatile: true,
    issystem: false,
    defaultuse: true,
    deploymentplanner: '',
    domain: 'domainId'
  };

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
      newSO,
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result).toBe(false);


    result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1']
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result).toBe(true);

    result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      <OfferingAvailability>{
        1: {
          filterOfferings: false,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result).toBe(true);
  });
  it('should get available by resources without config settings', () => {
    const availableOfferings = [newSO];
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
      <Zone>{ id: '1' }
    );
    expect(result).toEqual(availableOfferings);
  });

  it('should get available by resources', () => {
    const customizedOffering = {
      id: '1',
      name: 'Service Offering',
      displaytext: 'About disk offering',
      diskBytesReadRate: 1,
      diskBytesWriteRate: 1,
      diskIopsReadRate: 1,
      diskIopsWriteRate: 1,
      iscustomized: true,
      miniops: 1,
      maxiops: 1,
      storagetype: StorageTypes.local,
      provisioningtype: '',
      created: new Date().toDateString(),
      networkrate: '',
      offerha: false,
      limitcpuuse: false,
      isvolatile: true,
      issystem: false,
      defaultuse: true,
      deploymentplanner: '',
      domain: 'domainId'
    };
    const availableOfferings = <any>[
      {
        id: '1',
        name: 'Service Offering',
        displaytext: 'About disk offering',
        diskBytesReadRate: 1,
        diskBytesWriteRate: 1,
        diskIopsReadRate: 1,
        diskIopsWriteRate: 1,
        iscustomized: false,
        miniops: 1,
        maxiops: 1,
        storagetype: StorageTypes.local,
        provisioningtype: '',
        created: new Date().toDateString(),
        cpunumber: 1,
        cpuspeed: 1000,
        memory: 1,
        networkrate: '',
        offerha: false,
        limitcpuuse: false,
        isvolatile: true,
        issystem: false,
        defaultuse: true,
        deploymentplanner: '',
        domain: 'domainId'
      },
      customizedOffering
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
      [newSO],
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      { '1': { cpunumber: { min: 1 }, memory: { min: 1 } } },
      resourceUsage,
      <Zone>{ id: '1' }
    );
    expect(result).toEqual([]);

    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;
    result = serviceOfferingService.getAvailableByResourcesSync(
      [newSO],
      <OfferingAvailability>{
        1: {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: []
        }
      },
      { '1': { cpunumber: { min: 1 }, memory: { min: 1 } } },
      resourceUsage,
      <Zone>{ id: '1' }
    );
    expect(result).toEqual(<Array<ServiceOffering>>availableOfferings);
  });
});
