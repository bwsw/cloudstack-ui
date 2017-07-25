import { Component, OnInit, Inject } from '@angular/core';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Volume } from '../../shared/models';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
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

  constructor(
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private spareDriveActionsService: SpareDriveActionsService,
    private vmService: VmService,
    @Inject('volume') private volume: Volume,
    @Inject('zoneId') private zoneId: string
  ) {}

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
      this.dialog.hide();
      return;
    }

    this.loading = true;
    this.spareDriveActionsService.attach({
      id: this.volume.id,
      virtualMachineId: this.virtualMachineId
    })
      .finally(() => this.loading = false)
      .subscribe(
        () => this.dialog.hide(this.virtualMachineId),
        error => this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        })
      );
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
