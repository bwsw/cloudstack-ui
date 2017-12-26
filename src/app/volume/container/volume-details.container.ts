import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as diskOfferingActions from '../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromDiskOfferings from '../../reducers/disk-offerings/redux/disk-offerings.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-details-container',
  template: `
    <cs-volume-sidebar-volume [volume]="volume$ | async"></cs-volume-sidebar-volume>
    <cs-description
      [description]="description"
      (descriptionChange)="changeDescription($event)"
    ></cs-description>
    <cs-volume-sidebar-disk-offering [offering]="offering$ | async"></cs-volume-sidebar-disk-offering>
  `
})
export class VolumeDetailsContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly volume$ = this.store.select(fromVolumes.getSelectedVolume);
  readonly offering$ = this.store.select(fromDiskOfferings.getSelectedOffering);
  public description;

  public volume: Volume;


  constructor(
    private store: Store<State>,
  ) {
    super();
  }

  public changeDescription(description) {
    this.store.dispatch(new volumeActions.ChangeDescription({
      volume: this.volume,
      description
    }));
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.volume$
      .takeUntil(this.unsubscribe$)
      .subscribe(volume => {
        if (volume) {
          this.volume = new Volume(volume);
          this.description = this.volume.description;
        }
      });
    console.log(this.volume);
  }

}
