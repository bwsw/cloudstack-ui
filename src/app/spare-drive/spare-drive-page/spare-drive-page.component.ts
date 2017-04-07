import { Component, OnInit, HostBinding } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import {
  DiskOffering,
  DiskOfferingService,
  JobsNotificationService,
  Volume,
  VolumeAttachmentData,
  VolumeService
} from '../../shared';

import { SpareDriveCreationComponent } from '../spare-drive-creation/spare-drive-creation.component';
import { ListService } from '../../shared/components/list/list.service';
import { VolumeTypes } from '../../shared/models/volume.model';
import { ZoneService } from '../../shared/services/zone.service';
import { Zone } from '../../shared/models/zone.model';
import { FilterService } from '../../shared/services/filter.service';
import { debounce } from 'lodash';
import { Observable } from 'rxjs';
import * as _ from 'lodash';


const spareDriveListFilters = 'spareDriveListFilters';

export interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

interface SpareDriveSection {
  zoneName: string;
  spareDrives: Array<Volume>;
}

@Component({
  selector: 'cs-spare-drive-page',
  templateUrl: 'spare-drive-page.component.html',
  styleUrls: ['spare-drive-page.component.scss'],
  providers: [ListService]
})
export class SpareDrivePageComponent implements OnInit {
  public selectedVolume: Volume;
  public volumes: Array<Volume>;

  public selectedZones: Array<Zone>;
  public zones: Array<Zone>;

  public sections: Array<SpareDriveSection>;

  @HostBinding('class.detail-list-container') public detailListContainer = true;

  constructor(
    private dialogService: MdlDialogService,
    private diskOfferingService: DiskOfferingService,
    private filter: FilterService,
    private jobsNotificationService: JobsNotificationService,
    private listService: ListService,
    private translateService: TranslateService,
    private volumeService: VolumeService,
    private zoneService: ZoneService
  ) {
    this.update = debounce(this.update, 300);
  }

  public ngOnInit(): void {
    this.listService.onSelected.subscribe((volume: Volume) => {
      this.selectedVolume = volume;
    });

    this.listService.onAction.subscribe(() => {
      this.showCreationDialog();
    });

    Observable.forkJoin([
      this.updateVolumeList(),
      this.updateZones()
    ])
      .subscribe(() => {
        this.initFilters();
        this.updateSections();
      });
  }

  public initFilters(): void {
    const params = this.filter.init(spareDriveListFilters, {
      'zones': { type: 'array', defaultOption: [] },
    });
    this.selectedZones = this.zones.filter(zone => params['zones'].find(id => id === zone.id));
    this.update();
  }

  public update(): void {
    this.filter.update(spareDriveListFilters, {
      'zones': this.selectedZones.map(_ => _.id),
    });
  }

  public updateSections(): void {
    if (!this.selectedZones) {
      return;
    }

    this.sections = _.sortBy(this.selectedZones, 'name')
      .map(zone => {
        return {
          zoneName: zone.name,
          spareDrives: this.volumes.filter(volume => volume.zoneId === zone.id)
        };
      });

    this.update();
  }

  public showRemoveDialog(volume: Volume): void {
    this.translateService.get([
      'YES',
      'NO',
      'CONFIRM_DELETE_VOLUME',
      'VOLUME_DELETE_DONE',
      'VOLUME_DELETE_FAILED'
    ])
      .switchMap(translatedStrings => {
        return this.dialogService.confirm(
          translatedStrings['CONFIRM_DELETE_VOLUME'],
          translatedStrings['NO'],
          translatedStrings['YES']
        );
      })
      .onErrorResumeNext()
      .subscribe(() => this.remove(volume));
  }

  public remove(volume: Volume): void {
    this.volumeService.remove(volume.id)
      .subscribe(
        () => {
          this.volumes = this.volumes.filter(listVolume => {
            return listVolume.id !== volume.id;
          });
          if (this.selectedVolume && this.selectedVolume.id === volume.id) {
            this.listService.onDeselected.next();
          }
          this.jobsNotificationService.finish({ message: 'VOLUME_DELETE_DONE' });
        },
        error => {
          this.dialogService.alert(error);
          this.jobsNotificationService.fail({ message: 'VOLUME_DELETE_FAILED' });
        }
      );
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SpareDriveCreationComponent,
      classes: 'spare-drive-creation-dialog'
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
    let notificationId = this.jobsNotificationService.add('VOLUME_CREATE_IN_PROGRESS');
    this.volumeService.create(volumeCreationData)
      .subscribe(
        volume => {
          if (volume.id) {
            this.diskOfferingService.get(volume.diskOfferingId)
              .subscribe((diskOffering: DiskOffering) => {
                volume.diskOffering = diskOffering;
                this.volumes.push(volume);
              });
          }
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_CREATE_DONE',
          });
        },
        error => {
          this.dialogService.alert(error.errortext);
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_CREATE_FAILED',
          });
        }
      );
  }

  public attach(data: VolumeAttachmentData): void {
    let notificationId = this.jobsNotificationService.add('VOLUME_ATTACH_IN_PROGRESS');
    this.volumeService.attach(data)
      .subscribe(
        volume => {
          this.volumes = this.volumes.filter(v => v.id !== volume.id);
          this.jobsNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_ATTACH_DONE',
          });
        },
        error => {
          this.translateService.get(error.message, error.params)
            .subscribe(str => this.dialogService.alert(str));
          this.jobsNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_ATTACH_FAILED',
          });
        });
  }

  public updateVolume(volume: Volume): void {
    this.volumes = this.volumes.map(vol => vol.id === volume.id ? volume : vol);

    if (this.selectedVolume && this.selectedVolume.id === volume.id) {
      this.selectedVolume = volume;
    }
  }

  private updateZones(): Observable<void> {
    return this.zoneService.getList()
      .map(zones => {
        this.zones = zones;
      });
  }

  private updateVolumeList(): Observable<void> {
    let diskOfferings: Array<DiskOffering>;

    return this.diskOfferingService.getList({ type: VolumeTypes.DATADISK })
      .switchMap((offerings: Array<DiskOffering>) => {
        diskOfferings = offerings;
        return this.volumeService.getList();
      })
      .map(volumes => {
        this.volumes = volumes
          .filter((volume: Volume) => !volume.virtualMachineId && !volume.isDeleted)
          .map(volume => {
            volume.diskOffering = diskOfferings.find(offering => offering.id === volume.diskOfferingId);
            return volume;
          });
      });
  }
}
