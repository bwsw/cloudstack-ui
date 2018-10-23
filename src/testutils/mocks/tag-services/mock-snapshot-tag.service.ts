import { Observable, of } from 'rxjs';
import { Snapshot } from '../../../app/shared/models/snapshot.model';

export class MockSnapshotTagService {
  public getDescription(snapshot: Snapshot): Observable<string> {
    return of('');
  }

  public setDescription(snapshot: Snapshot, description: string): Observable<Snapshot> {
    return of(snapshot);
  }
}
