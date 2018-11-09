import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Zone } from '../../../../app/shared/models';

const zones: Object[] = require('../fixtures/zones.json');

@Injectable()
export class MockZoneService {
  public getList(): Observable<Zone[]> {
    return of(zones).pipe(map(zoneList => zoneList as Zone[]));
  }
}
