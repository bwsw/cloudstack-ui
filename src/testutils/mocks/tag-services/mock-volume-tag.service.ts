import { Observable, of } from 'rxjs';

import { Volume } from '../../../app/shared/models/volume.model';

export class MockVolumeTagService {
  public getDescription(volume: Volume): Observable<string> {
    return of('');
  }

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return of(volume);
  }

  public markForRemoval(volume: Volume): Observable<Volume> {
    return of(volume);
  }
}
