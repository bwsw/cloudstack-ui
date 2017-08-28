import { Volume } from '../../../app/shared/models/volume.model';
import { Observable } from 'rxjs/Observable';


export class MockVolumeTagService {
  public getDescription(volume: Volume): Observable<string> {
    return Observable.of('');
  }

  public setDescription(volume: Volume, description: string): Observable<Volume> {
    return Observable.of(volume);
  }

  public markForRemoval(volume: Volume): Observable<Volume> {
    return Observable.of(volume);
  }
}
