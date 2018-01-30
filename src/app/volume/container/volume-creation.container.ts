import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';

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
import {
  VolumeCreationData,
  VolumeType
} from '../../shared/models/volume.model';


@Component({
  selector: 'cs-volume-creation-container',
  template: `
    <cs-volume-creation-dialog
      [isLoading]="loading$ | async"
      [diskOfferings]="offerings$ | async"
      [maxSize]="maxSize"
      [zones]="zones$ | async"
      [params]="params$ | async"
      (onVolumeCreate)="createVolume($event)"
      (onZoneUpdated)="updateZone($event)"
    >
    </cs-volume-creation-dialog>`,
})
export class VolumeCreationContainerComponent extends WithUnsubscribe() implements OnInit {
  @ViewChild(VolumeCreationDialogComponent) public volumeCreationDialogComponent: VolumeCreationDialogComponent;

  public loading$ = this.store.select(fromVolumes.isLoading);
  readonly offerings$ = this.store.select(fromDiskOfferings.selectAll);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly account$ = this.store.select(fromAccounts.selectUserAccount);
  readonly params$ = this.store.select(fromDiskOfferings.getParams);

  public maxSize = 2;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest({ type: VolumeType.DATADISK }));
    this.store.dispatch(new diskOfferingActions.LoadDefaultParamsRequest());

    this.account$
      .take(1)
      .filter(account => !!account)
      .subscribe((account) => {
        if (account.volumeavailable <= 0 || account.primarystorageavailable < 1) {
          this.handleInsufficientResources();
          return;
        }
        this.maxSize = account.primarystorageavailable;
      });

  }

  public createVolume(data: VolumeCreationData) {
    this.store.dispatch(new volumeActions.CreateVolume(data));
  }

  public updateZone(zone: Zone) {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest({
      zone: zone,
      maxSize: this.maxSize
    }));
  }

  private handleInsufficientResources(): void {
    this.volumeCreationDialogComponent.dialogRef.close();
    this.dialogService.alert({ message: 'ERRORS.VOLUME.VOLUME_LIMIT_EXCEEDED' });
  }
}
