import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as diskOfferingActions from '../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../reducers/disk-offerings/redux/disk-offerings.reducers';
import { State } from '../../reducers/index';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import { Volume } from '../../shared/models/volume.model';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-vm-volume-details-container',
  template: `
    <cs-volume-details
      [volume]="volume"
      [diskOffering]="offering$ | async"
    >
    </cs-volume-details>`,
})
export class VmVolumeDetailsContainerComponent extends WithUnsubscribe() implements OnInit {
  @Input()
  public volume: Volume;
  readonly offering$ = this.store.pipe(select(fromDiskOfferings.getSelectedOffering));

  constructor(private store: Store<State>) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new volumeActions.LoadSelectedVolume(this.volume.id));
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
  }
}
