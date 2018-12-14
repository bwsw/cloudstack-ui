import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';

import { State } from '../../../reducers/index';
import { AuthService } from '../../../shared/services/auth.service';
import { Account } from '../../models/account.model';
import { Volume } from '../../models/volume.model';
import { VolumeResizeData } from '../../services/volume.service';
import { VolumeType } from '../../models';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import { capabilitiesSelectors } from '../../../root-store';

@Component({
  selector: 'cs-volume-resize-container',
  template: `
    <cs-volume-resize
      [minSize]="minSize$ | async"
      [maxSize]="maxSize"
      [volume]="volume"
      [availableStorage]="availableStorage$ | async"
      [diskOfferings]="offerings$ | async"
      [maxRootCapability]="maxRootCapability$ | async"
      (diskResized)="resizeDisk($event)"
    >
    </cs-volume-resize>`,
})
export class VolumeResizeContainerComponent implements OnInit {
  readonly offerings$ = this.store.pipe(select(fromDiskOfferings.getAvailableOfferings));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));
  readonly availableStorage$ = this.store.pipe(select(fromAccounts.selectStorageAvailable));
  readonly minSize$ = this.store.pipe(select(capabilitiesSelectors.getCustomDiskOfferingMinSize));
  readonly maxRootCapability$ = this.store.pipe(
    select(capabilitiesSelectors.getCustomDiskOfferingMaxSize),
  );

  public volume: Volume;

  public maxSize = '2';

  constructor(
    public authService: AuthService,
    private store: Store<State>,
    private dialogRef: MatDialogRef<VolumeResizeContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.volume = data.volume;
  }

  public ngOnInit() {
    this.store.dispatch(
      new diskOfferingActions.LoadOfferingsRequest({ type: VolumeType.DATADISK }),
    );
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.volume.zoneid));

    this.account$
      .pipe(
        take(1),
        filter(account => !!account),
      )
      .subscribe((account: Account) => {
        this.maxSize = account.primarystorageavailable;
      });
  }

  public resizeDisk(params: VolumeResizeData): void {
    this.dialogRef.close(params);
  }
}
