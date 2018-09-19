import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomComputeOfferingRestrictions, ServiceOffering } from '../../../../app/shared/models';


@Injectable()
export class MockCustomServiceOfferingService {
  constructor(@Inject('mockCustomServiceOfferingServiceConfig') public config: {
    customOffering: ServiceOffering,
    customOfferingRestrictionsByZone: CustomComputeOfferingRestrictions
  }) {
  }

  public getCustomOfferingWithSetParams(): Observable<ServiceOffering> {
    return of(this.config.customOffering);
  }

  public getCustomOfferingWithSetParamsSync(): ServiceOffering {
    return this.config.customOffering;
  }

  public getCustomOfferingRestrictionsByZone(): Observable<CustomComputeOfferingRestrictions> {
    return of(this.config.customOfferingRestrictionsByZone);
  }

  public getCustomOfferingRestrictionsByZoneSync(): CustomComputeOfferingRestrictions {
    return this.config.customOfferingRestrictionsByZone;
  }
}
