import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceOffering } from '../../../../app/shared/models';

const serviceOfferings: ServiceOffering[] = require('../fixtures/serviceOfferings.json');

@Injectable()
export class MockServiceOfferingService {
  constructor(@Inject('mockServiceOfferingServiceConfig') public config: { value: any }) {}

  public getList(): Observable<ServiceOffering[]> {
    return of(serviceOfferings);
  }

  public getAvailableByResourcesSync(): ServiceOffering[] {
    return this.config.value;
  }
}
