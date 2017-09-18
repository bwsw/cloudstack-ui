import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';
import { SpareDriveAction } from './volume-action';
import { RecurringSnapshotsComponent } from '../../../snapshot/recurring-snapshots/recurring-snapshots.component';


@Injectable()
export class SpareDriveRecurringSnapshotsAction extends SpareDriveAction {
  public name = 'VOLUME_ACTIONS.SNAPSHOT_SCHEDULE';
  public icon = 'schedule';

  public activate(volume: Volume): Observable<any> {
    return this.dialog.open(RecurringSnapshotsComponent, {
      data: volume
    })
      .afterClosed();
  }
}
