import {
  Component,
  OnInit
} from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Volume } from '../../shared/models/volume.model';
import { ISnapshotData } from '../../shared/actions/volume-actions/volume-snapshot';


@Component({
  selector: 'cs-volume-snapshot-details-container',
  template: `
    <cs-volume-snapshot-details
      [volume]="volume"
      (onVolumeSnapshots)="onVolumeSnapshots($event)"
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
          this.volume = volume as Volume;
        }
      })
  }

  public onVolumeSnapshots(snapshotData: ISnapshotData): void {
    this.store.dispatch(new volumeActions.AddSnapshot({
      volume: this.volume,
      name: snapshotData.name,
      description: snapshotData.desc
    }));
  }

}
