import {
  Component,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { Volume } from '../../models/volume.model';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'cs-volume-actions-container',
  template: `
    <cs-volume-actions
      [volume]="volume"
      (onVolumeDelete)="onVolumeDelete($event)"
      (onVolumeAttach)="onVolumeAttach($event)"
      (onVolumeDetach)="onVolumeDetach($event)"
      (onVolumeSnapshots)="onVolumeSnapshots($event)"
    >
    </cs-volume-actions>`,
})
export class VolumeActionsContainerComponent extends WithUnsubscribe() {

  @Input() public volume: Volume;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {
    super();
  }

  public onVolumeDelete(volume: Volume): void {
    const payload = { volume: volume, route: this.route.snapshot.params.id };
    this.store.dispatch(new volumeActions.DeleteVolume(payload));
  }

  public onVolumeAttach(vmId: string): void {
    this.store.dispatch(new volumeActions.AttachVolume({ volumeId: this.volume.id, virtualMachineId: vmId }));
  }

  public onVolumeDetach(volume: Volume): void {
    this.store.dispatch(new volumeActions.DetachVolume(volume));
  }

  public onVolumeSnapshots(volume: Volume): void {
    this.store.dispatch(new volumeActions.UpdateVolume(volume));
  }

}
