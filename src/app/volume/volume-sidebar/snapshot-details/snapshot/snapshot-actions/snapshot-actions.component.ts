import { Component, Input } from '@angular/core';
import { State } from '../../../../../reducers/index';
import { Store } from '@ngrx/store';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { Volume } from '../../../../../shared/models/volume.model';
import {
  SnapshotAction,
  SnapshotActionsService
} from '../../../../../snapshot/snapshot-actions.service';

import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';
import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-snapshot-actions',
  templateUrl: 'snapshot-actions.component.html'
})
export class SnapshotActionsComponent {
  @Input() public snapshot: Snapshot;
  @Input() public volume: Volume;
  public actionInProgress: boolean;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    private dialogService: DialogService,
    private store: Store<State>,
  ) {
  }

  public onAction(action: SnapshotAction): void {
    this.actionInProgress = true;
    action.activate(this.snapshot)
      .subscribe(() => {
        this.actionInProgress = false;
        if (action.command === 'delete') {
          this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SNAPSHOT.CONFIRM_DELETION' })
            .onErrorResumeNext()
            .filter(res => Boolean(res))
            .subscribe(() => {
              this.store.dispatch(new snapshotActions.DeleteSnapshot(this.snapshot));
            });
        }
      });
  }
}
