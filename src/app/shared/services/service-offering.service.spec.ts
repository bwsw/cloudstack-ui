import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';
import { storageTypes } from '../models/offering.model';
import { ServiceOffering, ServiceOfferingAvailability, Zone } from '../models';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { ServiceOfferingService } from './service-offering.service';
import { TestStore } from '../../../testutils/ngrx-test-store';

@Injectable()
class MockErrorService {
  public send(): void {}
}

describe('Service-offering service', () => {
  let serviceOfferingService: ServiceOfferingService;
  const newSO = {
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
    storagetype: storageTypes.local,
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
    domain: 'domainId',
  } as ServiceOffering;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceOfferingService,
        { provide: ErrorService, useClass: MockErrorService },
        { provide: CacheService, useClass: MockCacheService },
        { provide: Store, useClass: TestStore },
      ],
      imports: [HttpClientTestingModule],
    });
    serviceOfferingService = TestBed.get(ServiceOfferingService);
  });

  it('should check offering is available in zone', () => {
    let result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      {
        filterOfferings: true,
        zones: {
          1: {
            diskOfferings: [],
            computeOfferings: [],
          },
        },
      } as ServiceOfferingAvailability,
      { id: '1' } as Zone,
    );
    expect(result).toBe(false);

    result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      {
        filterOfferings: true,
        zones: {
          1: {
            diskOfferings: [],
            computeOfferings: ['1'],
          },
        },
      } as ServiceOfferingAvailability,
      { id: '1' } as Zone,
    );
    expect(result).toBe(true);

    result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      {
        filterOfferings: true,
        zones: {
          1: {
            filterOfferings: false,
            diskOfferings: [],
            computeOfferings: [],
          },
        },
      } as ServiceOfferingAvailability,
      { id: '1' } as Zone,
    );
    expect(result).toBe(false);
  });
});
