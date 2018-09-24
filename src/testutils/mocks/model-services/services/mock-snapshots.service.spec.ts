import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Snapshot } from '../../../../app/shared/models';

const snapshots: Array<Snapshot> = require('../fixtures/snapshots.json');

@Injectable()
export class MockSnapshotsService {
  public getList(): Observable<Array<Snapshot>> {
    return of(snapshots);
  }
}
