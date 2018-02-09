import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Snapshot } from '../../../../app/shared/models';

const snapshots: Array<Snapshot> = require('../fixtures/snapshots.json');

@Injectable()
export class MockSnapshotsService {
  public getList(): Observable<Array<Snapshot>> {
    return Observable.of(snapshots);
  }
}
