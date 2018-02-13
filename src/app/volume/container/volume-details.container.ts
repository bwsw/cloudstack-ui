import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Volume, getDescription } from '../../shared/models/volume.model';

import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as diskOfferingActions from '../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromDiskOfferings from '../../reducers/disk-offerings/redux/disk-offerings.reducers';

@Component({
  selector: 'cs-volume-details-container',
  template: `
    <cs-volume-sidebar-volume [volume]="volume$ | async"></cs-volume-sidebar-volume>
    <cs-description
      [description]="description"
      (descriptionChange)="changeDescription($event)"
    ></cs-description>
    <cs-volume-sidebar-disk-offering
      [offering]="offering$ | async"
      [columns]="params$ | async"
    ></cs-volume-sidebar-disk-offering>
  `
})
export class VolumeDetailsContainerComponent implements OnInit {
  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);
  readonly offering$ = this.store.select(fromDiskOfferings.getSelectedOffering);
  readonly params$ = this.store.select(fromDiskOfferings.getParams);

  public description: string;
  public volume: Volume;

  constructor(
    private store: Store<State>
  ) {
  }

  public changeDescription(description) {
    this.volume$.take(1).subscribe((volume: Volume) => {
      this.store.dispatch(new volumeActions.ChangeDescription({
        volume,
        description
      }));
    });
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new diskOfferingActions.LoadDefaultParamsRequest());
    this.volume$
      .subscribe((volume: Volume) => {
        if (volume) {
          this.volume = volume;
          this.description = getDescription(this.volume);
        }
      });
  }
}
