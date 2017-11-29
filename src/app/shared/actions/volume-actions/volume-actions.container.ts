import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { Volume } from '../../models/volume.model';
import * as volumeActions from '../../../reducers/volumes/redux/volumes.actions';
import { AuthService } from '../../services/auth.service';
import { ISnapshotData } from './volume-snapshot';


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
export class VolumeActionsContainerComponent implements AfterViewInit {

  @Input() public volume: Volume;

  constructor(
    public dialogService: DialogService,
    public authService: AuthService,
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) { }

  public ngAfterViewInit() {
    this.cd.detectChanges();
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

  public onVolumeSnapshots(snapshotData: ISnapshotData): void {
    this.store.dispatch(new volumeActions.AddSnapshot({
      volume: this.volume,
      name: snapshotData.name,
      description: snapshotData.desc
    }));
  }

}
