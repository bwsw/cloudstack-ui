import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DiskOffering, ServiceOffering } from '../../../../app/shared/models';


const _serviceOfferings: Array<Object> = require('../fixtures/serviceOfferings.json');

@Injectable()
export class MockServiceOfferingService {
  constructor(@Inject('mockServiceOfferingServiceConfig') public config: { value: any }) {}

  public getList(): Observable<Array<ServiceOffering>> {
    return Observable.of(_serviceOfferings.map(json => json as ServiceOffering));
  }

  public getAvailableByResourcesSync(): Array<ServiceOffering> {
    return this.config.value;
  }
}
