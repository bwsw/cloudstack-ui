import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  SnapshotCreationComponent
} from '../../../vm/vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';


@Injectable()
export class VolumeSnapshotAction extends VolumeAction {
  public name = 'VOLUME_ACTIONS.TAKE_SNAPSHOT';
  public icon = 'camera_alt';

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(SnapshotCreationComponent, {
      data: volume
    })
      .afterClosed();
  }
}
