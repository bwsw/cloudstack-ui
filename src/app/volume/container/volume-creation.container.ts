import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

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

@Component({
  selector: 'cs-volume-creation-container',
  template: `
    <cs-volume-creation-dialog
      [isLoading]="loading$ | async"
      [diskOfferings]="offerings$ | async"
      [maxSize]="maxSize"
      [zones]="zones$ | async"
      (volumeCreated)="createVolume($event)"
      (zoneUpdated)="updateZone($event)"
    >
    </cs-volume-creation-dialog>`,
})
export class VolumeCreationContainerComponent extends WithUnsubscribe() implements OnInit {
  @ViewChild(VolumeCreationDialogComponent)
  public volumeCreationDialogComponent: VolumeCreationDialogComponent;

  public loading$ = this.store.pipe(select(fromVolumes.isLoading));
  readonly offerings$ = this.store.pipe(select(fromDiskOfferings.selectAll));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));

  public maxSize = 2;

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
    this.account$
      .pipe(
        take(1),
        filter(Boolean),
      )
      .subscribe(account => {
        if (account.volumeavailable <= 0 || Number(account.primarystorageavailable) <= 0) {
          this.handleInsufficientResources();
          return;
        }
        this.maxSize = Number(account.primarystorageavailable);
        this.store.dispatch(
          new diskOfferingActions.LoadOfferingsRequest({
            zone,
            maxSize: this.maxSize,
          }),
        );
      });
  }

  private handleInsufficientResources(): void {
    this.volumeCreationDialogComponent.dialogRef.close();
    this.dialogService.alert({ message: 'ERRORS.VOLUME.VOLUME_LIMIT_EXCEEDED' });
  }
}
