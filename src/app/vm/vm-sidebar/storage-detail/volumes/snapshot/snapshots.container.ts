import {
  Component,
  Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/index';
import { Volume } from '../../../../../shared/models/volume.model';
import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';
import { Snapshot } from '../../../../../shared/models/snapshot.model';


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
  ) { }

  public snapshotDeleted(snapshot: Snapshot) {
    this.store.dispatch(new volumeActions.DeleteSnapshot({
      volume: this.volume,
      snapshot
    }));
  }
}
