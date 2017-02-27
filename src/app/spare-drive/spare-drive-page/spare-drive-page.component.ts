import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../../shared/services/volume.service';
import { Volume } from '../../shared/models/volume.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { TranslateService } from 'ng2-translate';
import { MdlDialogService } from 'angular2-mdl';
import { JobsNotificationService, INotificationStatus } from '../../shared/services/jobs-notification.service';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-spare-drive-page',
  templateUrl: 'spare-drive-page.component.html',
  styleUrls: ['spare-drive-page.component.scss']
})
export class SpareDrivePageComponent implements OnInit {
  public isDetailOpen: boolean;
  public volumes: Array<Volume>;
  public _selectedVolume: Volume;

  constructor(
    private dialogService: MdlDialogService,
    private diskOfferingService: DiskOfferingService,
    private jobsNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private volumeService: VolumeService
  ) {}

  public ngOnInit(): void {
    let diskOfferings: Array<DiskOffering>;
    this.diskOfferingService.getList({
      type: 'DATADISK'
    })
      .switchMap(offerings => {
        diskOfferings = offerings;
        return this.volumeService.getList();
      })
      .subscribe(volumes => {
        this.volumes = volumes
          .filter(volume => !volume.virtualMachineId)
          .map(volume => {
            volume.diskOffering = diskOfferings.find(offering => offering.id === volume.diskOfferingId);
            return volume;
          });
      });
  }

  public selectVolume(volume: Volume): void {
    this.selectedVolume = volume;
  }

  public get selectedVolume(): Volume {
    return this._selectedVolume;
  }

  public set selectedVolume(volume: Volume) {
    this._selectedVolume = volume;
    this.isDetailOpen = true;
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
    this._selectedVolume = null;
  }

  public showRemoveDialog(volume: Volume): void {
    let translatedStrings;
    this.translateService.get([
      'YES',
      'NO',
      'CONFIRM_DELETE_VOLUME',
      'VOLUME_DELETE_DONE',
      'VOLUME_DELETE_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        return this.dialogService.confirm(
          translatedStrings['CONFIRM_DELETE_VOLUME'],
          translatedStrings['NO'],
          translatedStrings['YES']
        );
      })
      .subscribe(() => {
        this.remove(volume);
      }, () => {});
  }

  public remove(volume: Volume): void {
    let notificationId;
    let translatedStrings;
    this.translateService.get([
      'VOLUME_DELETE_DONE',
      'VOLUME_DELETE_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        return this.volumeService.remove(volume.id);
      })
      .subscribe(
        () => {
          this.volumes = this.volumes.filter(listVolume => {
            return listVolume.id !== volume.id;
          });
          if (this.selectedVolume && this.selectedVolume.id === volume.id) {
            this.isDetailOpen = false;
          }
          this.jobsNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_DELETE_DONE'],
            status: INotificationStatus.Finished
          });
        },
        error => {
          this.notificationService.error(error);
          this.jobsNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_DELETE_FAILED'],
            status: INotificationStatus.Failed
          });
        }
      );
  }
}
