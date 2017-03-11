import { Component, OnInit, Inject } from '@angular/core';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-volume-attachment',
  templateUrl: 'volume-attachment.component.html'
})
export class VolumeAttachmentComponent implements OnInit {
  public virtualMachineId: string;
  public virtualMachines: Array<VirtualMachine>;

  constructor(
    private dialog: MdlDialogReference,
    private vmService: VmService,
    @Inject('zoneId') private zoneId: string
  ) {}

  public ngOnInit(): void {
    this.vmService.getList({ zoneId: this.zoneId })
      .subscribe(vmList => {
        this.virtualMachines = vmList;
        if (this.virtualMachines.length) {
          this.virtualMachineId = this.virtualMachines[0].id;
        }
      });
  }

  public attach(): void {
    this.dialog.hide(this.virtualMachineId);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
