import {
  Component,
  Input,
  OnChanges
} from '@angular/core';

import { VirtualMachine } from '../../shared/vm.model';
import { IsoAttachmentComponent } from '../../../template/iso-attachment/iso-attachment.component';
import { Iso, IsoService } from '../../../template/shared';
import { IsoEvent } from './iso.component';

import { Volume } from '../../../shared/models';
import { JobsNotificationService, NotificationService, VolumeService } from '../../../shared/services';
import { DialogService } from '../../../shared/services/dialog.service';


@Component({
  selector: 'cs-storage-detail',
  templateUrl: 'storage-detail.component.html',
  styleUrls: ['storage-detail.component.scss']
})
export class StorageDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public iso: Iso;

  constructor(
    private dialogService: DialogService,
    private jobNotificationService: JobsNotificationService,
    private isoService: IsoService,
    private notificationService: NotificationService,
    private volumeService: VolumeService
  ) {}

  public ngOnChanges(): void {
    if (this.vm.isoId) {
      this.isoService.get(this.vm.isoId)
        .subscribe((iso: Iso) => {
          this.iso = iso;
        });
    } else {
      this.iso = null;
    }
    this.subscribeToVolumeAttachments();
  }

  public subscribeToVolumeAttachments(): void {
    this.volumeService.onVolumeAttached.subscribe((volume: Volume) => {
      if (volume.virtualMachineId === this.vm.id) {
        this.vm.volumes.push(volume);
      }
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

  public showVolumeDetachDialog(volume: Volume): void {
    this.dialogService.confirm('CONFIRM_VOLUME_DETACH', 'NO', 'YES')
      .onErrorResumeNext()
      .subscribe(() => this.detachVolume(volume));
  }

  private detachVolume(volume: Volume): void {
    let notificationId = this.jobNotificationService.add('VOLUME_DETACH_IN_PROGRESS');
    this.volumeService.detach(volume.id)
      .subscribe(
        () => {
          this.vm.volumes = this.vm.volumes.filter(vmVolume => {
            return volume.id !== vmVolume.id;
          });
          this.jobNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_DETACH_DONE'
          });
        },
        error => {
          this.notificationService.error(error.errortext);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_DETACH_FAILED'
          });
        }
      );
  }

  private attachIsoDialog(): void {
    this.dialogService.showCustomDialog({
      component: IsoAttachmentComponent,
      classes: 'iso-attachment-dialog',
      providers: [{ provide: 'zoneId', useValue: this.vm.zoneId }]
    })
      .switchMap(res => res.onHide())
      .subscribe((iso: Iso) => {
        if (!iso) {
          return;
        }
        this.attachIso(iso);
      });
  }

  private detachIsoDialog(): void {
    this.dialogService.confirm('CONFIRM_ISO_DETACH', 'NO', 'YES')
      .subscribe(
        () => this.detachIso(),
        () => {}
      );
  }

  private attachIso(iso: Iso): void {
    let notificationId = this.jobNotificationService.add('ISO_ATTACH_IN_PROGRESS');
    this.isoService.attach(this.vm.id, iso)
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
    let notificationId = this.jobNotificationService.add('ISO_DETACH_IN_PROGRESS');

    this.isoService.detach(this.vm.id)
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
