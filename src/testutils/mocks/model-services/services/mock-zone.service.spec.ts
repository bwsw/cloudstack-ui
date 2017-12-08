import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../../../../app/shared/models';


const zones: Array<Object> = require('../fixtures/zones.json');

@Injectable()
export class MockZoneService {
  public getList(): Observable<Array<Zone>> {
    return Observable.of(zones).map(zoneList => zoneList as Zone[]);
  }
}
