import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { Volume } from '../../../models';
import { VirtualMachine } from '../../../../vm/shared/vm.model';
import { VmService } from '../../../../vm/shared/vm.service';


@Component({
  selector: 'cs-volume-attachment',
  templateUrl: 'volume-attachment.component.html',
  styleUrls: ['volume-attachment.component.scss']
})
export class VolumeAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  public virtualMachines: Array<VirtualMachine>;
  public loading: boolean;

  public volume: Volume;
  public zoneId: string;

  constructor(
    private dialogRef: MatDialogRef<VolumeAttachmentComponent>,
    private vmService: VmService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.volume = data.volume;
    this.zoneId = data.zoneId;
  }

  public ngOnInit(): void {
    this.vmService.getListWithDetails({ zoneId: this.zoneId })
      .subscribe(vmList => {
        this.virtualMachines = vmList;
        if (this.virtualMachines.length) {
          this.virtualMachineId = this.virtualMachines[0].id;
        }
      });
  }

  public attach(): void {
    if (!this.virtualMachineId) {
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close(this.virtualMachineId);
  }
}
