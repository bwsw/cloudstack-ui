import { Component, Inject, OnInit, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import { State } from '../../../reducers/index';
import * as serviceOfferingActions from '../../../reducers/service-offerings/redux/service-offerings.actions';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import { AuthService } from '../../../shared/services/auth.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { Volume } from '../../models/volume.model';
import { VolumeResizeData } from '../../services/volume.service';

@Component({
  selector: 'cs-volume-resize-container',
  template: `
    <cs-volume-resize
      [maxSize]="maxSize"
      [volume]="volume"
      [diskOfferings]="offerings$ | async"
      (onDiskResized)="resizeDisk($event)"
    >
    </cs-volume-resize>`,
})
export class VolumeResizeContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly offerings$ = this.store.select(fromDiskOfferings.getAvailableOfferings);
  readonly account$ = this.store.select(fromAuth.getUserAccount);

  public volume: Volume;

  public maxSize = 2;

  constructor(
    public authService: AuthService,
    private store: Store<State>,
    private dialogRef: MatDialogRef<VolumeResizeContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    super();
    this.volume = data.volume;
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest());
    this.store.dispatch(new serviceOfferingActions.LoadOfferingAvailabilityRequest());
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.volume.zoneId));

    this.account$
      .takeUntil(this.unsubscribe$)
      .subscribe((account) => {
        if (account) {
          this.maxSize = account.primarystorageavailable;
        }
      });
  }

  public resizeDisk(params: VolumeResizeData): void {
    this.dialogRef.close(params);
  }

}
