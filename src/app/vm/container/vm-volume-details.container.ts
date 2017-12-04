import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as diskOfferingActions from '../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../reducers/disk-offerings/redux/disk-offerings.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-vm-volume-details-container',
  template: `
    <cs-volume-details 
      [volume]="volume"
      [description]="description"
      [diskOffering]="offering$ | async"
    >      
    </cs-volume-details>`
})
export class VmVolumeDetailsContainerComponent extends WithUnsubscribe() implements OnInit {

  @Input() public volume: Volume;
  readonly offering$ = this.store.select(fromDiskOfferings.getSelectedOffering);
  public description;

  constructor(
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new volumeActions.LoadSelectedVolume(this.volume.id));
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.description = this.volume.description;
  }

}
