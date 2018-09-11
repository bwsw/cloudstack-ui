import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomComputeOfferingRestrictions, ServiceOffering } from '../../../../app/shared/models';


@Injectable()
export class MockCustomServiceOfferingService {
  constructor(@Inject('mockCustomServiceOfferingServiceConfig') public config: {
    customOffering: ServiceOffering,
    customOfferingRestrictionsByZone: CustomComputeOfferingRestrictions
  }) {
  }

  public getCustomOfferingWithSetParams(): Observable<ServiceOffering> {
    return Observable.of(this.config.customOffering);
  }

  public getCustomOfferingWithSetParamsSync(): ServiceOffering {
    return this.config.customOffering;
  }

  public getCustomOfferingRestrictionsByZone(): Observable<CustomComputeOfferingRestrictions> {
    return Observable.of(this.config.customOfferingRestrictionsByZone);
  }

  public getCustomOfferingRestrictionsByZoneSync(): CustomComputeOfferingRestrictions {
    return this.config.customOfferingRestrictionsByZone;
  }
}
