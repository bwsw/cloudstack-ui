import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CustomComputeOfferingParameters, ServiceOffering } from '../../../../app/shared/models';


@Injectable()
export class MockCustomServiceOfferingService {
  constructor(@Inject('mockCustomServiceOfferingServiceConfig') public config: {
    customOffering: ServiceOffering,
    customOfferingRestrictionsByZone: CustomComputeOfferingParameters
  }) {
  }

  public getCustomOfferingWithSetParams(): Observable<ServiceOffering> {
    return Observable.of(this.config.customOffering);
  }

  public getCustomOfferingWithSetParamsSync(): ServiceOffering {
    return this.config.customOffering;
  }

  public getCustomOfferingRestrictionsByZone(): Observable<CustomComputeOfferingParameters> {
    return Observable.of(this.config.customOfferingRestrictionsByZone);
  }

  public getCustomOfferingRestrictionsByZoneSync(): CustomComputeOfferingParameters {
    return this.config.customOfferingRestrictionsByZone;
  }
}
