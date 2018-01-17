import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Volume, getDescription } from '../../shared/models/volume.model';
import { ConfigService } from '../../shared/services/config.service';

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
      [columns]="diskOfferingColumns"
    ></cs-volume-sidebar-disk-offering>
  `
})
export class VolumeDetailsContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);
  readonly offering$ = this.store.select(fromDiskOfferings.getSelectedOffering);
  public description;
  public diskOfferingColumns: Array<string> = [
    'name',
    'bytesreadrate',
    'byteswriterate',
    'iopsreadrate',
    'iopswriterate'
  ];

  public volume: Volume;


  constructor(
    private store: Store<State>,
    private configService: ConfigService
  ) {
    super();
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
    this.setDiskOfferingColumns();
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.volume$
      .takeUntil(this.unsubscribe$)
      .subscribe((volume: Volume) => {
        if (volume) {
          this.volume = volume;
          this.description = getDescription(this.volume);
        }
      });
  }

  public setDiskOfferingColumns() {
    const configParams = this.configService.get('diskOfferingParameters');
    if (configParams) {
      this.diskOfferingColumns = this.diskOfferingColumns.concat(configParams);
    }
  }
}
