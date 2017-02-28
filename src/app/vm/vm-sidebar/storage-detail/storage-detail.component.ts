import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { VirtualMachine } from '../../shared/vm.model';
import { IsoAttachmentComponent } from '../../../template/iso-attachment/iso-attachment.component';
import { JobsNotificationService, INotificationStatus } from '../../../shared/services/jobs-notification.service';
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
  public expandStorage: boolean;

  constructor(
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    private jobNotificationService: JobsNotificationService,
    private isoService: IsoService,
    private notificationService: NotificationService,
    private volumeService: VolumeService
  ) {
    this.expandStorage = false;
  }

  public ngOnChanges(): void {
    if (this.vm.isoId) {
      this.isoService.get(this.vm.isoId)
        .subscribe((iso: Iso) => {
          this.iso = iso;
        });
    } else {
      this.iso = null;
    }
  }

  public toggleStorage(): void {
    this.expandStorage = !this.expandStorage;
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
      .subscribe(
        () => this.detachVolume(volume),
        () => {}
      );
  }

  private detachVolume(volume: Volume): void {
    let notificationId;
    let translatedStrings;
    this.translateService.get([
      'VOLUME_DETACH_IN_PROGRESS',
      'VOLUME_DETACH_DONE',
      'VOLUME_DETACH_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        notificationId = this.jobNotificationService.add(translatedStrings['VOLUME_DETACH_IN_PROGRESS']);
        return this.volumeService.detach(volume.id);
      })
      .subscribe(
        () => {
          this.vm.volumes = this.vm.volumes.filter(vmVolume => {
            return volume.id !== vmVolume.id;
          });
          this.jobNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_DETACH_DONE'],
            status: INotificationStatus.Finished
          })
        },
        error => {
          this.notificationService.error(error.json().detachvolumeresponse.errortext);
          this.jobNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_DETACH_FAILED'],
            status: INotificationStatus.Failed
          });
        }
      );
  }

  private attachIsoDialog(): void {
    this.dialogService.showCustomDialog({
      component: IsoAttachmentComponent,
      classes: 'iso-attachment-dialog',
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
    let translations;
    let notificationId;

    this.translateService.get([
      'ISO_ATTACH_IN_PROGRESS',
      'ISO_ATTACH_DONE',
      'ISO_ATTACH_FAILED'
    ])
      .switchMap(strs => {
        translations = strs;
        notificationId = this.jobNotificationService.add(translations['ISO_ATTACH_IN_PROGRESS']);
        return this.isoService.attach(this.vm.id, iso);
      })
      .subscribe(
        (attachedIso: Iso) => {
          this.iso = attachedIso;
          this.jobNotificationService.add({
            id: notificationId,
            message: translations['ISO_ATTACH_DONE'],
            status: INotificationStatus.Finished
          });
        },
        error => {
          this.iso = null;
          this.notificationService.error(error);
          this.jobNotificationService.add({
            id: notificationId,
            message: translations['ISO_ATTACH_FAILED'],
            status: INotificationStatus.Failed
          });
        });
  }

  private detachIso(): void {
    let translations;
    let notificationId;

    this.translateService.get([
      'ISO_DETACH_IN_PROGRESS',
      'ISO_DETACH_DONE',
      'ISO_DETACH_FAILED'
    ])
      .switchMap(strs => {
        translations = strs;
        notificationId = this.jobNotificationService.add(translations['ISO_DETACH_IN_PROGRESS']);
        return this.isoService.detach(this.vm.id);
      })
      .subscribe(() => {
        this.iso = null;
        this.jobNotificationService.add({
          id: notificationId,
          message: translations['ISO_DETACH_DONE'],
          status: INotificationStatus.Finished
        });
      }, () => {
        this.iso = null;
        this.jobNotificationService.add({
          id: notificationId,
          message: translations['ISO_DETACH_FAILED'],
          status: INotificationStatus.Failed
        });
      });
  }
}
