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
        filterOfferings: true,
        zones: {
          1: {
            diskOfferings: [],
            serviceOfferings: []
          }
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result).toBe(false);


    result = serviceOfferingService['isOfferingAvailableInZone'](
      newSO,
      <OfferingAvailability>{
        filterOfferings: true,
        zones: {
          1: {
            diskOfferings: [],
            serviceOfferings: ['1']
          }
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result).toBe(true);
  });
});
