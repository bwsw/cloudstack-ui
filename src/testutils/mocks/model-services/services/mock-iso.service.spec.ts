import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Iso } from '../../../../app/template/shared';

const isos: Array<Iso> = require('../fixtures/diskOfferings.json');

@Injectable()
export class MockIsoService {
  public getList(): Observable<Array<Iso>> {
    return of(isos);
  }
}
