import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Snapshot } from '../../../../app/shared/models';

const snapshots: Snapshot[] = require('../fixtures/snapshots.json');

@Injectable()
export class MockSnapshotsService {
  public getList(): Observable<Snapshot[]> {
    return of(snapshots);
  }
}
