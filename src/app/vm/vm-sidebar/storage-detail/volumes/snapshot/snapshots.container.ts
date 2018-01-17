import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/index';
import { Volume } from '../../../../../shared/models/volume.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';

import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshots-container',
  template: `
    <cs-snapshots
      [volume]="volume"
      (onSnapshotDelete)="snapshotDeleted($event)"
    >
    </cs-snapshots>`,
})
export class SnapshotsContainerComponent {
  @Input() public volume: Volume;

  constructor(
    private store: Store<State>,
  ) {
  }

  public snapshotDeleted(snapshot: Snapshot) {
    this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
  }
}
