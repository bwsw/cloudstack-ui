import { ServiceOfferingService } from './service-offering.service';
import { OfferingAvailability } from './offering.service';
import { Zone } from '../models/zone.model';
import {ServiceOffering} from '../models/service-offering.model';
import {TestBed} from '@angular/core/testing';
import {MockConfigService} from '../../../testutils/mocks/model-services/services/mock-config.service.spec';
import {ConfigService} from './config.service';
import {ServiceLocator} from './service-locator';
import {Injector} from '@angular/core';
import {ErrorService} from './error.service';
import {HttpModule} from '@angular/http';

describe('Service-offering service', () => {

  let serviceOfferingService: ServiceOfferingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceOfferingService,
        ErrorService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
      imports: [
        HttpModule
      ]
    });
    ServiceLocator.injector = TestBed.get(Injector);
    serviceOfferingService = TestBed.get(ServiceOfferingService);
  });

  it('should check offering is available in zone', () => {
    let result = serviceOfferingService['isOfferingAvailableInZone'](
      new ServiceOffering({ id: '1' }),
      <OfferingAvailability>{ 1: {filterOfferings: true, diskOfferings: [], serviceOfferings: []} },
      new Zone({ id: '1' })
    );
    expect(result).toBe(false);
    result = serviceOfferingService['isOfferingAvailableInZone'](
      new ServiceOffering({ id: '1' }),
      <OfferingAvailability>{ 1: {filterOfferings: false, diskOfferings: [], serviceOfferings: []} },
      new Zone({ id: '1' })
    );
    expect(false).toBe(true);
  });
});