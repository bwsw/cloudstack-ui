import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { State } from '../../reducers/index';
import { getDescription, Volume } from '../../shared/models/volume.model';
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
    ></cs-volume-sidebar-disk-offering>
  `,
})
export class VolumeDetailsContainerComponent implements OnInit {
  readonly volume$ = this.store.pipe(select(fromVolumes.getSelectedVolume));
  readonly offering$ = this.store.pipe(select(fromDiskOfferings.getSelectedOffering));

  public description: string;
  public volume: Volume;

  constructor(private store: Store<State>) {}

  public changeDescription(description) {
    this.volume$.pipe(take(1)).subscribe((volume: Volume) => {
      this.store.dispatch(
        new volumeActions.ChangeDescription({
          volume,
          description,
        }),
      );
    });
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.volume$.subscribe((volume: Volume) => {
      if (volume) {
        this.volume = volume;
        this.description = getDescription(this.volume);
      }
    });
  }
}
