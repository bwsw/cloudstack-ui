import { Component, OnInit, Input } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs';

import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';
import { VolumeResizeComponent } from '../../volume-resize.component';

import {
  INotificationStatus,
  JobsNotificationService,
  NotificationService,
  SnapshotService,
  StatsUpdateService
} from '../../../../shared/services';

import { Volume, Snapshot } from '../../../../shared/models';


@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss']
})
export class VolumeComponent implements OnInit {
  @Input() public volume: Volume;

  constructor(
    private translateService: TranslateService,
    private dialogService: MdlDialogService,
    private jobNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    private snapshotService: SnapshotService,
    private notificationService: NotificationService
  ) { }

  public ngOnInit(): void { }

  public showVolumeResizeDialog(volume: Volume): void {
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
          classes: 'volume-resize-dialog',
          providers: [{ provide: 'volume', useValue: volume }]
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
          volume.size = (data as Volume).size;

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
      classes: 'snapshot-creation-dialog',
      providers: [{ provide: 'volumeId', useValue: volumeId }],
    });
  }

  public handleSnapshotDelete(snapshot: Snapshot): void {
    let notificationId: string;
    let translations;

    this.translateService.get([
      'CONFIRM_SNAPSHOT_DELETE',
      'SNAPSHOT_DELETE_IN_PROGRESS',
      'SNAPSHOT_DELETE_DONE',
      'SNAPSHOT_DELETE_FAILED'
    ])
      .switchMap(strs => {
        translations = strs;
        return this.dialogService.confirm(strs['CONFIRM_SNAPSHOT_DELETE']);
      })
      .switchMap(() => {
        notificationId = this.jobNotificationService.add(translations['SNAPSHOT_DELETE_IN_PROGRESS']);
        return this.snapshotService.remove(snapshot.id);
      })
      .subscribe(
        () => {
          this.removeSnapshotFromVolume(snapshot);
          this.jobNotificationService.add({
            id: notificationId,
            message: translations['SNAPSHOT_DELETE_DONE'],
            status: INotificationStatus.Finished
          });
        },
        error => {
          this.notificationService.error(error);
          this.jobNotificationService.add({
            id: notificationId,
            message: translations['SNAPSHOT_DELETE_FAILED'],
            status: INotificationStatus.Failed
          });
        }
      );
  }

  private removeSnapshotFromVolume(snapshot: Snapshot): void {
    this.volume.snapshots = this.volume.snapshots.filter(volumeSnapshot => {
      return volumeSnapshot.id !== snapshot.id;
    });
  }
}
