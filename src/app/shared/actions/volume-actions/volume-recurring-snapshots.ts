import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { VolumeAction } from './volume-action';
import { RecurringSnapshotsComponent } from '../../../snapshot/recurring-snapshots/recurring-snapshots.component';
import { MatDialog } from '@angular/material';


@Injectable()
export class VolumeRecurringSnapshotsAction implements VolumeAction {
  public name = 'VOLUME_ACTIONS.SNAPSHOT_SCHEDULE';
  public command = 'schedule';
  public icon = 'schedule';

  constructor( public dialog: MatDialog) { }

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(RecurringSnapshotsComponent, {
      data: volume
    })
      .afterClosed();
  }

  public hidden = (volume: Volume) => false;
}
