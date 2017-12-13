import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import * as fromVMs from '../../../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../../../reducers/vm/redux/vm.actions';
import { Volume } from '../../../models/volume.model';

@Component({
  selector: 'cs-volume-attachment-container',
  template: `
    <cs-volume-attachment
      *loading="loading$ | async"
      [volume]="volume"
      [zoneId]="zoneId"
      [virtualMachines]="vms$ | async"
      (onVirtualMachineId)="attachVolume($event)"
    >
    </cs-volume-attachment>`,
})
export class VolumeAttachmentContainerComponent implements OnInit {

  public volume: Volume;
  public zoneId: string;

  readonly vms$ = this.store.select(fromVMs.getAttachmentVMs);
  readonly loading$ = this.store.select(fromVMs.isLoading);

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<VolumeAttachmentContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.volume = data.volume;
    this.zoneId = data.zoneId;
  }

  public ngOnInit() {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.store.dispatch(new vmActions.VMAttachmentFilterUpdate({ account: this.volume.account, domainId: this.volume.domainid }));
  }

  public attachVolume(virtualMachineId: string) {
    this.dialogRef.close(virtualMachineId);
  }

}
