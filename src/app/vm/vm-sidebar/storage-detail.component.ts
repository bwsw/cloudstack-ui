import {
  Component,
  Input,
} from '@angular/core';

import { MdlDialogService } from 'angular2-mdl';
import { VirtualMachine } from '../vm.model';
import { SnapshotCreationComponent } from '../../snapshot/snapshot-creation.component';
import { TranslateService } from 'ng2-translate';
import { JobsNotificationService, INotificationStatus } from '../../shared/services/jobs-notification.service';
import { StatsUpdateService } from '../../shared/services/stats-update.service';
import { VolumeResizeComponent } from './volume-resize.component';
import { Observable } from 'rxjs/Rx';
import { Volume } from '../../shared/models/volume.model';


@Component({
  selector: 'cs-storage-detail',
  templateUrl: 'storage-detail.component.html',
  styleUrls: ['storage-detail.component.scss']
})
export class StorageDetailComponent {
  @Input() public vm: VirtualMachine;
  private expandStorage: boolean;

  constructor(
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    private jobNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService
  ) {
    this.expandStorage = false;
  }

  public toggleStorage() {
    this.expandStorage = !this.expandStorage;
  }

  public showVolumeResizeDialog(): void {
    let notificationId: string;
    let translations;

    this.translateService.get([
      'VOLUME_RESIZING',
      'VOLUME_RESIZED',
      'VOLUME_RESIZE_FAILED',
      'VOLUME_NEWSIZE_LOWER',
      'VOLUME_PRIMARY_STORAGE_EXCEEDED'
    ])
      .switchMap(res => {
        translations = res;
        return this.dialogService.showCustomDialog({
          component: VolumeResizeComponent,
          providers: [{ provide: 'volume', useValue: this.vm.volumes[0] }],
          isModal: true,
          styles: { 'width': '400px' },
          enterTransitionDuration: 400,
          leaveTransitionDuration: 400
        });
      })
      .switchMap(res => res.onHide())
      .switchMap((data: any) => {
        if (data) {
          notificationId = this.jobNotificationService.add(translations['VOLUME_RESIZING']);
          return data;
        }
        return Observable.of(undefined);
      })
      .subscribe((data: any) => {
          if (!data) {
            return;
          }
          this.vm.volumes[0].size = (data as Volume).size;

          this.jobNotificationService.add({
            id: notificationId,
            message: translations['VOLUME_RESIZED'],
            status: INotificationStatus.Finished
          });

          this.statsUpdateService.next();
        },
        error => {
          let message = '';

          // can't rely on error codes, native ui just prints errortext
          if (error.errortext.startsWith('Going from')) {
            message = translations['VOLUME_NEWSIZE_LOWER'];
          } else if (error.errortext.startsWith('Maximum number of')) {
            message = translations['VOLUME_PRIMARY_STORAGE_EXCEEDED'];
          } else {
            // don't know what errors may occur,
            // so print errortext like native ui
            message = error.errortext;
          }

          this.jobNotificationService.add({
            id: notificationId,
            message: translations['VOLUME_RESIZE_FAILED'],
            status: INotificationStatus.Failed
          });
          this.dialogService.alert(message);
        }
      );
  }

  public takeSnapshot(volumeId: string): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      providers: [{ provide: 'volumeId', useValue: volumeId }],
      isModal: true,
      styles: { 'width': '400px' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
