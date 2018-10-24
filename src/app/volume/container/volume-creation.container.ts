import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { State } from '../../reducers/index';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as diskOfferingActions from '../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromDiskOfferings from '../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as fromZones from '../../reducers/zones/redux/zones.reducers';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VolumeCreationDialogComponent } from '../volume-creation/volume-creation-dialog.component';
import { Zone } from '../../shared/models/zone.model';
import { VolumeCreationData, VolumeType } from '../../shared/models/volume.model';
import { Account } from '../../shared/models';

@Component({
  selector: 'cs-volume-creation-container',
  template: `
    <cs-volume-creation-dialog
      [isLoading]="loading$ | async"
      [diskOfferings]="offerings$ | async"
      [storageAvailable]="storageAvailable$ | async"
      [zones]="zones$ | async"
      [account]="account$ | async"
      (onVolumeCreate)="createVolume($event)"
      (onZoneUpdated)="updateZone($event)"
    >
    </cs-volume-creation-dialog>`,
})
export class VolumeCreationContainerComponent extends WithUnsubscribe() implements OnInit {
  @ViewChild(VolumeCreationDialogComponent)
  public volumeCreationDialogComponent: VolumeCreationDialogComponent;
  readonly loading$ = this.store.pipe(select(fromVolumes.isLoading));
  readonly offerings$ = this.store.pipe(select(fromDiskOfferings.selectAll));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));
  readonly storageAvailable$ = this.account$.pipe(
    filter(Boolean),
    map((account: Account) => account.primarystorageavailable),
  );

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(
      new diskOfferingActions.LoadOfferingsRequest({ type: VolumeType.DATADISK }),
    );
  }

  public createVolume(data: VolumeCreationData) {
    this.store.dispatch(new volumeActions.CreateVolume(data));
  }

  public updateZone(zone: Zone) {
    this.storageAvailable$.subscribe(maxSize => {
      this.store.dispatch(
        new diskOfferingActions.LoadOfferingsRequest({
          maxSize,
          zone,
        }),
      );
    });
  }
}
