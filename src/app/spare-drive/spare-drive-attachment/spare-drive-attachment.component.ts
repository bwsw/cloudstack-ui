import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';
import { Volume } from '../../shared/models';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SpareDriveActionsService } from '../spare-drive-actions.service';


@Component({
  selector: 'cs-spare-drive-attachment',
  templateUrl: 'spare-drive-attachment.component.html',
  styleUrls: ['spare-drive-attachment.component.scss']
})
export class SpareDriveAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  public virtualMachines: Array<VirtualMachine>;
  public loading: boolean;

  private volume: Volume;
  private zoneId: string;

  constructor(
    private dialogRef: MdDialogRef<SpareDriveAttachmentComponent>,
    private dialogService: DialogService,
    private spareDriveActionsService: SpareDriveActionsService,
    private vmService: VmService,
    @Inject(MD_DIALOG_DATA) data
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

    this.loading = true;
    this.spareDriveActionsService.attach({
      id: this.volume.id,
      virtualMachineId: this.virtualMachineId
    })
      .finally(() => this.loading = false)
      .subscribe(
        () => this.dialogRef.close(this.virtualMachineId),
        error => this.dialogService.alert({
          message: {
            translationToken: error.message,
            interpolateParams: error.params
          }
        })
      );
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
