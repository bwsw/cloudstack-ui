import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { Volume } from '../../models/volume.model';
import * as accountActions from '../../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import * as diskOfferingActions from '../../../reducers/disk-offerings/redux/disk-offerings.actions';
import * as fromDiskOfferings from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';
import * as fromZones from '../../../reducers/zones/redux/zones.reducers';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'cs-volume-actions-container',
  template: `
    <cs-volume-actions
      [volume]="volume"
      [diskOfferings]="offerings$ | async"
      [maxSize]="maxSize"
      (onVolumeDelete)="onVolumeDelete($event)"
      (onVolumeAttach)="onVolumeAttach($event)"
      (onVolumeDetach)="onVolumeDetach($event)"
      (onVolumeResize)="onVolumeResize($event)"
      (onVolumeSnapshots)="onVolumeSnapshots($event)"
    >
    </cs-volume-actions>`,
})
export class VolumeActionsContainerComponent extends WithUnsubscribe() implements OnInit {

  @Input() public volume: Volume;
  readonly offerings$ = this.store.select(fromDiskOfferings.selectAll);
  readonly zone$ = this.store.select(fromZones.getSelectedZone);
  readonly account$ = this.store.select(fromAccounts.getUserAccount);

  public maxSize: number = 2;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
  ) {
    super();
  }

  public ngOnInit() {
    //this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.volume.zoneId));
    this.store.dispatch(new accountActions.LoadUserAccount({
      account: this.authService.user.account,
      domainid: this.authService.user.domainid
    }));

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


  public onVolumeDelete(volume: Volume): void {
    this.store.dispatch(new volumeActions.DeleteVolume(volume));
  }

  public onVolumeAttach(vmId: string): void {
    this.store.dispatch(new volumeActions.AttachVolume({ volumeId: this.volume.id, virtualMachineId: vmId }));
  }

  public onVolumeDetach(volume: Volume): void {
    this.store.dispatch(new volumeActions.DetachVolume(volume));
  }

  public onVolumeResize(volume: Volume): void {
    this.store.dispatch(new volumeActions.UpdateVolume(volume));
  }

  public onVolumeSnapshots(volume: Volume): void {
    this.store.dispatch(new volumeActions.UpdateVolume(volume));
  }

}
