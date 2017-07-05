import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ServiceOffering } from '../../../../app/shared/models';


const serviceOfferings: Array<Object> = require('../fixtures/serviceOfferings.json');

@Injectable()
export class MockServiceOfferingService {
  public getList(): Observable<Array<ServiceOffering>> {
    return Observable.of(serviceOfferings.map(json => new ServiceOffering(json)));
  }
}
