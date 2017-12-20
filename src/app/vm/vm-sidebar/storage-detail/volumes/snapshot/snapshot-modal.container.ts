import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/index';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { Volume } from '../../../../../shared/models/volume.model';
import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../../../../reducers/volumes/redux/volumes.reducers';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
import { WithUnsubscribe } from '../../../../../utils/mixins/with-unsubscribe';


@Component({
  selector: 'cs-snapshot-modal-container',
  template: `
    <cs-snapshot-modal
      [volume]="volume$ | async"
      (onSnapshotDelete)="snapshotDeleted($event)"
    >
    </cs-snapshot-modal>`,
})
export class SnapshotModalContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);

  public volume: Volume;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<SnapshotModalContainerComponent>,
    private store: Store<State>,
  ) {
    super();
    this.store.dispatch(new volumeActions.LoadSelectedVolume(data.volumeId));
  }

  public ngOnInit() {
    this.volume$
      .takeUntil(this.unsubscribe$)
      .filter(volume => !!volume)
      .subscribe(volume => {
        // todo remove model
        this.volume = volume as Volume;
        if (!this.volume.snapshots.length) {
          this.dialogRef.close();
        }
      });
  }

  public snapshotDeleted(snapshot: Snapshot) {
    this.store.dispatch(new volumeActions.DeleteSnapshot({
      volume: this.volume,
      snapshot
    }));
  }
}
