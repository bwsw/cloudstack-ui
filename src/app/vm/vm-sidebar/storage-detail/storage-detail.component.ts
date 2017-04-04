import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { VirtualMachine } from '../../shared/vm.model';
import { IsoAttachmentComponent } from '../../../template/iso-attachment/iso-attachment.component';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { Iso, IsoService } from '../../../template/shared';
import { NotificationService } from '../../../shared/services/notification.service';
import { IsoEvent } from './iso-attachment.component';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';


@Component({
  selector: 'cs-storage-detail',
  templateUrl: 'storage-detail.component.html',
  styleUrls: ['storage-detail.component.scss']
})
export class StorageDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public iso: Iso;

  constructor(
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
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
    this.translateService.get([
      'CONFIRM_VOLUME_DETACH',
      'YES',
      'NO'
    ])
      .switchMap(translatedStrings => {
        return this.dialogService.confirm(
          translatedStrings['CONFIRM_VOLUME_DETACH'],
          translatedStrings['NO'],
          translatedStrings['YES']
        );
      })
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
          this.notificationService.error(error.json().detachvolumeresponse.errortext);
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
    this.translateService.get('CONFIRM_ISO_DETACH')
      .switchMap(str => {
        return this.dialogService.confirm(str);
      })
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
