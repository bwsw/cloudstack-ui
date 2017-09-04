import { Snapshot } from '../../../app/shared/models/snapshot.model';
import { Observable } from 'rxjs/Observable';


export class MockSnapshotTagService {
  public getDescription(snapshot: Snapshot): Observable<string> {
    return Observable.of('');
  }

  public setDescription(snapshot: Snapshot, description: string): Observable<Snapshot> {
    return Observable.of(snapshot);
  }
}
