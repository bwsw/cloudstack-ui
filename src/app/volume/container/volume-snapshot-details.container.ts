import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { State } from '../../reducers/index';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { Volume } from '../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-snapshot-details-container',
  template: `
    <cs-volume-snapshot-details
      [volume]="volume$ | async"
      (onSnapshotAdd)="addSnapshot($event)"
    >
    </cs-volume-snapshot-details>`,
})
export class VolumeSnapshotDetailsContainerComponent {

  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);

  constructor(
    public dialogService: DialogService,
    private store: Store<State>,
  ) {
  }


  public addSnapshot(volume: Volume): void {
    this.store.dispatch(new volumeActions.AddSnapshot(volume));
  }

}
