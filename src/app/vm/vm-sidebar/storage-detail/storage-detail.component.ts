import { Component, Input, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';
import { DialogsService } from '../../../dialog/dialog-service/dialog.service';

import { Volume } from '../../../shared/models';
import { JobsNotificationService, NotificationService } from '../../../shared/services';
import { VolumeService } from '../../../shared/services/volume.service';
import { SpareDriveActionsService } from '../../../spare-drive/spare-drive-actions.service';
import { IsoAttachmentComponent } from '../../../template/iso-attachment/iso-attachment.component';
import { Iso, IsoService } from '../../../template/shared';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { IsoEvent } from './iso.component';


@Component({
  selector: 'cs-storage-detail',
  templateUrl: 'storage-detail.component.html',
  styleUrls: ['storage-detail.component.scss']
})
export class StorageDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public iso: Iso;
  public isoOperationInProgress = false;

  constructor(
    private dialog: MdDialog,
    private dialogsService: DialogsService,
    private jobNotificationService: JobsNotificationService,
    private isoService: IsoService,
    private notificationService: NotificationService,
    private spareDriveActionService: SpareDriveActionsService,
    private vmService: VmService,
    private volumeService: VolumeService
  ) {
  }

  public ngOnChanges(): void {
    if (this.vm.isoId) {
      this.isoService.get(this.vm.isoId)
        .subscribe((iso: Iso) => this.iso = iso);
    } else {
      this.iso = null;
    }
    this.subscribeToVolumeAttachments();
  }

  public get volumes(): Array<Volume> {
    return this.vm.volumes.sort((a, b) => {
      if (a.isRoot) { return -1; }
      if (b.isRoot) { return  1; }

      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return  1; }
      return 0;
    });
  }

  public subscribeToVolumeAttachments(): void {
    this.spareDriveActionService.onVolumeAttachment
      .subscribe(() => {
        this.volumeService.getList({ virtualMachineId: this.vm.id })
          .subscribe(volumes => this.vm.volumes = volumes);
      });
  }

  public handleIsoAction(event: IsoEvent): void {
    if (event === IsoEvent.isoAttach) {
      return this.attachIsoDialog();
    }
    if (event === IsoEvent.isoDetach) {
      return this.detachIsoDialog();
    }
  }

  public onVolumeChange(): void {
    this.vmService.updateVmInfo(this.vm);
  }

  public showVolumeDetachDialog(volume: Volume): void {
    this.dialogsService.confirm({
      message: 'CONFIRM_VOLUME_DETACH'
    })
      .onErrorResumeNext()
      .subscribe((res) => { if (res) { this.detachVolume(volume); } });
  }

  private detachVolume(volume: Volume): void {
    volume['loading'] = true;
    this.spareDriveActionService.detach(volume)
      .finally(() => volume['loading'] = false)
      .subscribe(() => this.onVolumeChange());
  }

  private attachIsoDialog(): void {
    this.dialog.open(IsoAttachmentComponent, {
      panelClass: 'iso-attachment-dialog',
      data: this.vm.zoneId
    })
      .afterClosed()
      .subscribe((iso: Iso) => {
        if (iso) {
          this.attachIso(iso);
        }
      });
  }

  private detachIsoDialog(): void {
    this.dialogsService.confirm({
      message: 'CONFIRM_ISO_DETACH'
    })
      .onErrorResumeNext()
      .subscribe((res) => { if (res) { this.detachIso(); } });
  }

  private attachIso(iso: Iso): void {
    const notificationId = this.jobNotificationService.add('ISO_ATTACH_IN_PROGRESS');
    this.isoOperationInProgress = true;
    this.isoService.attach(this.vm.id, iso)
      .finally(() => this.isoOperationInProgress = false)
      .subscribe(
        (attachedIso: Iso) => {
          this.iso = attachedIso;
          this.vm.isoId = this.iso.id;
          this.jobNotificationService.finish({
            id: notificationId,
            message: 'ISO_ATTACH_DONE'
          });
        },
        error => {
          this.iso = undefined;
          this.notificationService.error(error.errortext);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'ISO_ATTACH_FAILED'
          });
        });
  }

  private detachIso(): void {
    const notificationId = this.jobNotificationService.add('ISO_DETACH_IN_PROGRESS');
    this.isoOperationInProgress = true;

    this.isoService.detach(this.vm.id)
      .finally(() => this.isoOperationInProgress = false)
      .subscribe(() => {
        this.iso = undefined;
        this.vm.isoId = undefined;
        this.jobNotificationService.finish({
          id: notificationId,
          message: 'ISO_DETACH_DONE'
        });
      }, () => {
        this.iso = null;
        this.jobNotificationService.fail({
          id: notificationId,
          message: 'ISO_DETACH_FAILED'
        });
      });
  }
}
