import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Iso } from '../../../../app/template/shared';


const isos: Array<Object> = require('../fixtures/diskOfferings.json');

@Injectable()
export class MockIsoService {
  public getList(): Observable<Array<Iso>> {
    return Observable.of(isos.map(json => new Iso(json)));
  }
}
