import {
  Component,
  Input
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { State } from '../../../../../reducers/index';
import { Store } from '@ngrx/store';
import { Volume } from '../../../../../shared/models';
import {
  SnapshotAction,
  SnapshotActionsService
} from '../../../../../snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot-modal.component';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;
  public actions: Array<SnapshotAction>;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    private dialog: MatDialog,
    private store: Store<State>,
  ) {
    this.actions = snapshotActionsService.actions;
  }

  public showSnapshots(): void {
    this.dialog.open(SnapshotModalComponent, {
      data: { volume: this.volume },
      width: '700px'
    }).afterClosed()
      .subscribe(volume => this.store.dispatch(new volumeActions.UpdateVolume(volume)));
  }

  public onAction(action: SnapshotAction, snapshot: Snapshot) {
    action.activate(snapshot, this.volume).subscribe(
      res => {
        if (action.command === 'delete') {
          this.store.dispatch(new volumeActions.UpdateVolume(new Volume(res)));
        }
      });
  }
}
