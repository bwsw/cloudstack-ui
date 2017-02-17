import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { VirtualMachine } from '../shared/vm.model';
import { IsoAttachmentComponent } from '../../template/iso-attachment/iso-attachment.component';
import { JobsNotificationService, INotificationStatus } from '../../shared/services/jobs-notification.service';
import { Iso, IsoService } from '../../template/shared';
import { NotificationService } from '../../shared/services/notification.service';
import { IsoEvent } from '../../iso/iso.component';


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
    private notificationService: NotificationService

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

  // public showVolumeResizeDialog(volume: Volume): void {
  //   let notificationId: string;
  //   let translations;
  //
  //   this.translateService.get([
  //     'VOLUME_RESIZING',
  //     'VOLUME_RESIZED',
  //     'VOLUME_RESIZE_FAILED',
  //     'VOLUME_NEWSIZE_LOWER',
  //     'VOLUME_PRIMARY_STORAGE_EXCEEDED'
  //   ])
  //     .switchMap(res => {
  //       translations = res;
  //       return this.dialogService.showCustomDialog({
  //         component: VolumeResizeComponent,
  //         classes: 'volume-resize-dialog',
  //         providers: [{ provide: 'volume', useValue: volume }]
  //       });
  //     })
  //     .switchMap(res => res.onHide())
  //     .switchMap((data: any) => {
  //       if (data) {
  //         notificationId = this.jobNotificationService.add(translations['VOLUME_RESIZING']);
  //         return data;
  //       }
  //       return Observable.of(undefined);
  //     })
  //     .subscribe((data: any) => {
  //         if (!data) {
  //           return;
  //         }
  //         volume.size = (data as Volume).size;
  //
  //         this.jobNotificationService.add({
  //           id: notificationId,
  //           message: translations['VOLUME_RESIZED'],
  //           status: INotificationStatus.Finished
  //         });
  //
  //         this.statsUpdateService.next();
  //       },
  //       error => {
  //         let message = '';
  //
  //         // can't rely on error codes, native ui just prints errortext
  //         if (error.errortext.startsWith('Going from')) {
  //           message = translations['VOLUME_NEWSIZE_LOWER'];
  //         } else if (error.errortext.startsWith('Maximum number of')) {
  //           message = translations['VOLUME_PRIMARY_STORAGE_EXCEEDED'];
  //         } else {
  //           // don't know what errors may occur,
  //           // so print errortext like native ui
  //           message = error.errortext;
  //         }
  //
  //         this.jobNotificationService.add({
  //           id: notificationId,
  //           message: translations['VOLUME_RESIZE_FAILED'],
  //           status: INotificationStatus.Failed
  //         });
  //         this.dialogService.alert(message);
  //       }
  //     );
  // }

  // public takeSnapshot(volumeId: string): void {
  //   this.dialogService.showCustomDialog({
  //     component: SnapshotCreationComponent,
  //     classes: 'snapshot-creation-dialog',
  //     providers: [{ provide: 'volumeId', useValue: volumeId }],
  //   });
  // }

  // // todo: move to volume component
  // public deleteSnapshotDialog(snapshot: Snapshot): void {
  //   this.translateService.get('CONFIRM_SNAPSHOT_DELETE')
  //     .switchMap(str => {
  //       return this.dialogService.confirm(str);
  //     })
  //     .subscribe(
  //       () => this.deleteSnapshot(snapshot),
  //       () => {}
  //     );
  // }

  public handleIsoAction(event: IsoEvent): void {
    if (event === IsoEvent.isoAttach) {
      return this.attachIsoDialog();
    }
    if (event === IsoEvent.isoDetach) {
      return this.detachIsoDialog();
    }
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
