import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { State } from '../../reducers/index';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { Volume } from '../../shared/models/volume.model';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';


@Component({
  selector: 'cs-volume-snapshot-details-container',
  template: `
    <cs-volume-snapshot-details
      [volume]="volume"
      (onSnapshotAdd)="addSnapshot($event)"
    >
    </cs-volume-snapshot-details>`,
})
export class VolumeSnapshotDetailsContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);

  public volume: Volume;

  constructor(
    public dialogService: DialogService,
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    this.volume$
      .takeUntil(this.unsubscribe$)
      .subscribe(volume => {
        if (volume) {
          this.volume = new Volume(volume);
        }
      })
  }

  public addSnapshot(volume): void {
    this.store.dispatch(new volumeActions.AddSnapshot(volume));
  }

}
