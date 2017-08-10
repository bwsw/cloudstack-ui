import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models/volume.model';
import { SpareDriveAction } from './spare-drive-action';


@Injectable()
export class SpareDriveResizeAction extends SpareDriveAction {
  public activate(volume: Volume): Observable<any> {

  }
}
