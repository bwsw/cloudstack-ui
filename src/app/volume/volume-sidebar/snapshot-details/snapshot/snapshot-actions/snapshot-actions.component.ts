import { Component, Input } from '@angular/core';
import { State } from '../../../../../reducers/index';
import { Store } from '@ngrx/store';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { Volume } from '../../../../../shared/models/volume.model';
import {
  SnapshotAction,
  SnapshotActionsService
} from '../../../../../snapshot/snapshot-actions.service';

import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';

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
    private store: Store<State>,
  ) {
  }

  public onAction(action: SnapshotAction): void {
    this.actionInProgress = true;
    action.activate(this.snapshot)
      .subscribe(() => {
        this.actionInProgress = false;
        if (action.command === 'delete') {
          this.store.dispatch(new volumeActions.DeleteSnapshot({
            volume: this.volume,
            snapshot: this.snapshot
          }));
        }
      });
  }
}
