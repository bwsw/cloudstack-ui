import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SnapshotCreationComponent } from '../../../vm/vm-sidebar/storage-detail/volumes/snapshot-creation/snapshot-creation.component';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { MatDialog } from '@angular/material';


@Injectable()
export class VolumeSnapshotAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.TAKE_SNAPSHOT';
  public command = 'snapshot';
  public icon = 'camera_alt';

  constructor( public dialog: MatDialog) { }

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(SnapshotCreationComponent, {
      data: volume
    })
      .afterClosed();
  }

  public hidden = (volume: Volume) => false;
}
