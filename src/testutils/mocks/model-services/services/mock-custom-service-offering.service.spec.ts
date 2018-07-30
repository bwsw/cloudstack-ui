import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line
import { CustomServiceOffering } from '../../../../app/service-offering/custom-service-offering/custom-service-offering';
import { ICustomOfferingRestrictionsByZone } from '../../../../app/shared/models';


@Injectable()
export class MockCustomServiceOfferingService {
  constructor(@Inject('mockCustomServiceOfferingServiceConfig') public config: {
    customOffering: CustomServiceOffering,
    customOfferingRestrictionsByZone: ICustomOfferingRestrictionsByZone
  }) {
  }

  public getCustomOfferingWithSetParams(): Observable<CustomServiceOffering> {
    return Observable.of(this.config.customOffering);
  }

  public getCustomOfferingWithSetParamsSync(): CustomServiceOffering {
    return this.config.customOffering;
  }

  public getCustomOfferingRestrictionsByZone(): Observable<ICustomOfferingRestrictionsByZone> {
    return Observable.of(this.config.customOfferingRestrictionsByZone);
  }

  public getCustomOfferingRestrictionsByZoneSync(): ICustomOfferingRestrictionsByZone {
    return this.config.customOfferingRestrictionsByZone;
  }
}
