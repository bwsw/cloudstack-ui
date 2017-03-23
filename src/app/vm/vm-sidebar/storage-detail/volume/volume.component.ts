import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
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
import { VolumeService } from '../../../../shared/services/volume.service';


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
    private volumeService: VolumeService,
    private notificationService: NotificationService,
    private translateService: TranslateService
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
      .switchMap((newSize: any) => {
        if (newSize != null) {
          notificationId = this.jobNotificationService.add('VOLUME_RESIZING');
          return this.volumeService.resize({ id: volume.id, size: newSize });
        }
        return Observable.of(undefined);
      })
      .subscribe((newVolume: Volume) => {
          if (!newVolume) {
            return;
          }
          volume.size = newVolume.size;

          this.jobNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_RESIZED'
          });

          this.statsUpdateService.next();
        },
        error => {
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_RESIZE_FAILED'
          });
          this.translateService.get(error.message)
            .subscribe(str => this.dialogService.alert(str));
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
