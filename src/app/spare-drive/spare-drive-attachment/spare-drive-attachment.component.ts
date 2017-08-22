import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Volume } from '../../shared/models';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VolumeService } from '../../shared/services/volume.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';


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
    @Inject('volume') private volume: Volume,
    @Inject('zoneId') private zoneId: string,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private vmService: VmService,
    private volumeService: VolumeService
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
    const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_IN_PROGRESS');

    this.volumeService.attach({
      id: this.volume.id,
      virtualMachineId: this.virtualMachineId
    })
      .do(() => {
        this.jobsNotificationService.finish({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_DONE',
        });
      })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
        this.jobsNotificationService.fail({
          id: notificationId,
          message: 'JOB_NOTIFICATIONS.VOLUME.ATTACHMENT_FAILED',
        });
        return Observable.throw(error);
      })
      .finally(() => this.loading = false)
      .subscribe(() => this.dialog.hide(this.virtualMachineId));
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
