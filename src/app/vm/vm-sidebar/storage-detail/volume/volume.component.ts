import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { Observable } from 'rxjs';

import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';
import { VolumeResizeComponent } from '../../volume-resize.component';

import {
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
  @Output() public onDetach = new EventEmitter();

  constructor(
    private dialogService: MdlDialogService,
    private jobNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    private snapshotService: SnapshotService,
    private notificationService: NotificationService
  ) { }

  public ngOnInit(): void { }

  public get volumeType(): 'Data' | 'Root' {
    if (this.volume.type === 'ROOT') {
      return 'Root';
    }
    if (this.volume.type === 'DATADISK') {
      return 'Data';
    }
    throw new Error('Unrecognized volume type');
  }

  public detach(): void {
    this.onDetach.emit(this.volume);
  }

  public showVolumeResizeDialog(volume: Volume): void {
    let notificationId: string;

    this.dialogService.showCustomDialog({
      component: VolumeResizeComponent,
      classes: 'volume-resize-dialog',
      providers: [{ provide: 'volume', useValue: volume }]
    })
      .switchMap(res => res.onHide())
      .switchMap((data: any) => {
        if (data) {
          notificationId = this.jobNotificationService.add('VOLUME_RESIZING');
          return data;
        }
        return Observable.of(undefined);
      })
      .subscribe((data: any) => {
          if (!data) {
            return;
          }
          volume.size = (data as Volume).size;

          this.jobNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_RESIZED'
          });

          this.statsUpdateService.next();
        },
        error => {
          let message = '';

          // can't rely on error codes, native ui just prints errortext
          if (error.errortext.startsWith('Going from')) {
            message = 'VOLUME_NEWSIZE_LOWER';
          } else if (error.errortext.startsWith('Maximum number of')) {
            message = 'VOLUME_PRIMARY_STORAGE_EXCEEDED';
          } else {
            // don't know what errors may occur,
            // so print errortext like native ui
            message = error.errortext;
          }

          this.jobNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_RESIZE_FAILED'
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
    this.dialogService.confirm('CONFIRM_SNAPSHOT_DELETE')
      .switchMap(() => {
        notificationId = this.jobNotificationService.add('SNAPSHOT_DELETE_IN_PROGRESS');
        return this.snapshotService.remove(snapshot.id);
      })
      .subscribe(
        () => {
          this.removeSnapshotFromVolume(snapshot);
          this.jobNotificationService.finish({
            id: notificationId,
            message: 'SNAPSHOT_DELETE_DONE'
          });
        },
        error => {
          this.notificationService.error(error);
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'SNAPSHOT_DELETE_FAILED'
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
