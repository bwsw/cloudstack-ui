import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../../shared/services/volume.service';
import { Volume } from '../../shared/models/volume.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { MdlDialogService } from 'angular2-mdl';
import { VolumeCreationComponent } from '../volume-creation/volume-creation.component';
import { NotificationService } from '../../shared/services/notification.service';
import { JobsNotificationService, INotificationStatus } from '../../shared/services/jobs-notification.service';
import { TranslateService } from 'ng2-translate';


export interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

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

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: VolumeCreationComponent,
      classes: 'volume-creation-dialog'
    })
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.createVolume(data);
      }, () => {});
  }

  public createVolume(volumeCreationData: VolumeCreationData): void {
    let notificationId;
    let translatedStrings;

    this.translateService.get([
      'VOLUME_CREATE_IN_PROGRESS',
      'VOLUME_CREATE_DONE',
      'VOLUME_CREATE_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        notificationId = this.jobsNotificationService.add(translatedStrings['VOLUME_CREATE_IN_PROGRESS']);
        return this.volumeService.create(volumeCreationData);
      })
      .subscribe(
        volume => {
          if (volume.id) {
            this.diskOfferingService.get(volume.diskOfferingId)
              .subscribe(diskOffering => {
                volume.diskOffering = diskOffering;
                this.volumes.push(volume);
              })
          }
          this.jobsNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_CREATE_DONE'],
            status: INotificationStatus.Finished
          });
        },
        error => {
          // todo: CS-3168
          this.notificationService.error(error.json().createvolumeresponse.errortext);
          this.jobsNotificationService.add({
            id: notificationId,
            message: translatedStrings['VOLUME_CREATE_FAILED'],
            status: INotificationStatus.Failed
          });
        }
      );
  }
}
