import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as fromZones from '../../../reducers/zones/redux/zones.reducers';
import { AuthService } from '../../../shared/services/auth.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import {
  Volume,
  VolumeType
} from '../../models/volume.model';
import { VolumeResizeData } from '../../services/volume.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';

@Component({
  selector: 'cs-volume-resize-container',
  template: `
    <cs-volume-resize
      [maxSize]="maxSize"
      [volume]="volume"
      [diskOfferings]="offerings$ | async"
      (onDiskResized)="onDiskResized($event)"
    >
    </cs-volume-resize>`,
})
export class VolumeResizeContainerComponent extends WithUnsubscribe() implements OnInit {

  public loading$ = this.store.select(fromDiskOfferings.isLoading);
  readonly offerings$ = this.store.select(fromDiskOfferings.selectAll);
  readonly zone$ = this.store.select(fromZones.getSelectedZone);
  readonly account$ = this.store.select(fromAuth.getUserAccount);

  public volume: Volume;

  public maxSize: number = 2;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
    public dialogRef: MatDialogRef<VolumeResizeContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    super();
    this.volume = data.volume;
  }

  public ngOnInit() {
    this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest({ type: VolumeType.DATADISK }));
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.volume.zoneId));

    this.zone$
      .takeUntil(this.unsubscribe$)
      .subscribe(zone => {
        if (zone) {
          this.store.dispatch(new diskOfferingActions.LoadOfferingsRequest({
            zone: zone
          }));
        }
      });

    this.account$
      .takeUntil(this.unsubscribe$)
      .subscribe((account) => {
        if (account) {
          this.maxSize = account.primarystorageavailable;
        }
      });
  }

  public onDiskResized(params: VolumeResizeData): void {
    this.store.dispatch(new volumeActions.ResizeVolume(params));
    this.dialogRef.close();
  }

}
