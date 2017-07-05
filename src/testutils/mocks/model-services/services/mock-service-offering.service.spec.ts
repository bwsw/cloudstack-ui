import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ServiceOffering, Zone } from '../../../../app/shared/models';
import { OfferingAvailability } from '../../../../app/shared/services/offering.service';
import { CustomOfferingRestrictions } from '../../../../app/service-offering/custom-service-offering/custom-offering-restrictions';
import { ResourceStats } from '../../../../app/shared/services';


const _serviceOfferings: Array<Object> = require('../fixtures/serviceOfferings.json');

@Injectable()
export class MockServiceOfferingService {
  constructor(@Inject('mockServiceOfferingServiceConfig') public config: { value: any }) {}

  public getList(): Observable<Array<ServiceOffering>> {
    return Observable.of(_serviceOfferings.map(json => new ServiceOffering(json)));
  }

  public getAvailableByResourcesSync(): Array<ServiceOffering> {
    return this.config.value;
  }
}
