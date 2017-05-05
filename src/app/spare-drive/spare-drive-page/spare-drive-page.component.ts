import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  DialogService,
  DiskOffering,
  DiskOfferingService,
  FilterService,
  JobsNotificationService,
  Volume,
  VolumeTypes,
  Zone,
  ZoneService
} from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { UserService } from '../../shared/services/user.service';
import { VolumeService } from '../../shared/services/volume.service';

import { SpareDriveCreationComponent } from '../spare-drive-creation/spare-drive-creation.component';

import debounce = require('lodash/debounce');
import sortBy = require('lodash/sortBy');
import { SpareDriveActionsService } from '../spare-drive-actions.service';


const spareDriveListFilters = 'spareDriveListFilters';
const askToCreateVolume = 'askToCreateVolume';

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
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private filter: FilterService,
    private jobsNotificationService: JobsNotificationService,
    private listService: ListService,
    private spareDriveActionsService: SpareDriveActionsService,
    private userService: UserService,
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

    this.spareDriveActionsService.onVolumeAttachment.subscribe(() => {
      this.onVolumeAttached();
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

    this.sections = sortBy(this.selectedZones, 'name')
      .map(zone => {
        return {
          zoneName: zone.name,
          spareDrives: this.volumes.filter(volume => volume.zoneId === zone.id)
        };
      });

    this.update();
  }

  public get noFilteringResults(): boolean {
    if (this.selectedZones && this.selectedZones.length) {
      return !this.sectionsLength;
    } else {
      return !this.volumes || !this.volumes.length;
    }
  }

  private get sectionsLength(): number {
    if (!this.sections) {
      return 0;
    }
    return this.sections.reduce((acc, section) => acc + section.spareDrives.length, 0);
  }

  public showRemoveDialog(volume: Volume): void {
    this.dialogService.confirm('CONFIRM_DELETE_VOLUME', 'NO', 'YES')
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
          this.updateSections();
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
                this.updateSections();
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

  public attach(data): void {
    this.spareDriveActionsService.attach(data);
  }

  public updateVolume(volume: Volume): void {
    this.volumes = this.volumes.map(vol => vol.id === volume.id ? volume : vol);

    if (this.selectedVolume && this.selectedVolume.id === volume.id) {
      this.selectedVolume = volume;
    }
    this.updateSections();
  }

  private onVolumeAttached(): void {
    this.updateVolumeList();
    this.updateSections();
  }

  private showSuggestionDialog(): void {
    this.userService.readTag(askToCreateVolume)
      .subscribe(tag => {
        if (tag === 'false') {
          return;
        }

        this.dialogService.showDialog({
          message: 'WOULD_YOU_LIKE_TO_CREATE_VOLUME',
          actions: [
            {
              handler: () => { this.showCreationDialog(); },
              text: 'YES'
            },
            {
              text: 'NO'
            },
            {
              handler: () => this.userService.writeTag(askToCreateVolume, 'false').subscribe(),
              text: 'NO_DONT_ASK'
            }
          ],
          fullWidthAction: true,
          isModal: true,
          clickOutsideToClose: true,
          styles: { 'width': '320px' }
        });

      });
  }

  private updateZones(): Observable<void> {
    return this.zoneService.getList().map(zones => { this.zones = zones; });
  }

  private updateVolumeList(): Observable<void> {
    let diskOfferings: Array<DiskOffering>;

    return this.diskOfferingService.getList({ type: VolumeTypes.DATADISK })
      .switchMap((offerings: Array<DiskOffering>) => {
        diskOfferings = offerings;
        return this.volumeService.getSpareList();
      })
      .map(volumes => {
        this.volumes = volumes
          .map(volume => {
            volume.diskOffering = diskOfferings.find(offering => offering.id === volume.diskOfferingId);
            return volume;
          });

        if (this.volumes.length) {
          this.updateSections();
        } else {
          this.showSuggestionDialog();
        }
      });
  }
}
