import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { DiskOffering, Volume, VolumeType, Zone, } from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { FilterService } from '../../shared/services/filter.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { UserService } from '../../shared/services/user.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveActionsService } from '../spare-drive-actions.service';
import { SpareDriveCreationComponent } from '../spare-drive-creation/spare-drive-creation.component';


const spareDriveListFilters = 'spareDriveListFilters';
const askToCreateVolume = 'csui.user.ask-to-create-volume';

export interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

@Component({
  selector: 'cs-spare-drive-page',
  templateUrl: 'spare-drive-page.component.html',
  providers: [ListService]
})
export class SpareDrivePageComponent implements OnInit, OnDestroy {
  @HostBinding('class.detail-list-container') public detailListContainer = true;
  public volumes: Array<Volume>;
  public zones: Array<Zone>;
  public selectedZones: Array<Zone> = [];
  public visibleVolumes: Array<Volume>;

  public selectedGroupingNames = [];
  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'SPARE_DRIVE_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: Volume) => item.zoneId,
      name: (item: Volume) => item.zoneName
    }
  ];

  private filterService = new FilterService({
    zones: { type: 'array', defaultOption: [] },
    groupings: { type: 'array', defaultOption: [] }
  }, this.router, this.localStorage, spareDriveListFilters, this.activatedRoute);
  private onDestroy = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private dialog: MdDialog,
    private diskOfferingService: DiskOfferingService,
    private jobsNotificationService: JobsNotificationService,
    private listService: ListService,
    private spareDriveActionsService: SpareDriveActionsService,
    private userService: UserService,
    private volumeService: VolumeService,
    private zoneService: ZoneService,
    private localStorage: LocalStorageService
  ) {
  }

  public ngOnInit(): void {
    this.listService.onAction
      .takeUntil(this.onDestroy)
      .subscribe(() => this.showCreationDialog());

    this.spareDriveActionsService.onVolumeAttachment
      .takeUntil(this.onDestroy)
      .subscribe(() => this.onVolumeAttached());

    Observable.forkJoin(
      this.updateVolumeList(),
      this.updateZones()
    ).subscribe(() => this.initFilters());
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    this.selectedZones = this.zones.filter(zone =>
      params['zones'].find(id => id === zone.id)
    );
    this.selectedGroupingNames = params.groupings.reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.update();
  }

  public update(): void {
    this.filterZones();
    this.updateGroupings();

    this.filterService.update(spareDriveListFilters, {
      zones: this.selectedZones.map(_ => _.id),
      groupings: this.selectedGroupingNames.map(_ => _.key)
    });
  }

  public updateGroupings(): void {
    this.selectedGroupings = this.selectedGroupingNames.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);
  }

  public filterZones(): void {
    if (this.selectedZones.length) {
      this.visibleVolumes = this.volumes.filter(volume =>
        this.selectedZones.some(z => volume.zoneId === z.id)
      );
    } else {
      this.visibleVolumes = this.volumes;
    }
  }

  public showRemoveDialog(volume: Volume): void {
    this.dialogService.confirm({
      message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_DELETION'
    })
      .onErrorResumeNext()
      .subscribe((res) => { if (res) { this.remove(volume); } });
  }

  public remove(volume: Volume): void {
    this.volumeService.remove(volume.id)
      .subscribe(
        () => {
          this.volumes = this.volumes.filter(listVolume => {
            return listVolume.id !== volume.id;
          });
          if (this.listService.isSelected(volume.id)) {
            this.listService.deselectItem();
          }
          this.jobsNotificationService.finish({ message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_DONE' });
          this.update();
        },
        error => {
          this.dialogService.alert({ message: error });
          this.jobsNotificationService.fail({ message: 'JOB_NOTIFICATIONS.VOLUME.DELETION_FAILED' });
        }
      );
  }

  public showCreationDialog(): void {
    this.dialog.open(SpareDriveCreationComponent, {
       width: '450px',
       disableClose: true
    }).afterClosed()
        .subscribe((volume: Volume) => {
          if (volume) {
            this.volumes.push(volume);
            this.update();
          }
        });
  }

  public updateVolume(volume: Volume): void {
    this.volumes = this.volumes.map(vol => vol.id === volume.id ? volume : vol);

    if (this.listService.isSelected(volume.id)) {
      this.listService.showDetails(volume.id);
    }
    this.update();
  }

  private onVolumeAttached(): void {
    this.updateVolumeList().subscribe();
    this.update();
  }

  private showSuggestionDialog(): void {
    this.userService.readTag(askToCreateVolume)
      .subscribe(tag => {
        if (tag === 'false') {
          return;
        }

        this.dialogService.askDialog({
          message: 'SUGGESTION_DIALOG.WOULD_YOU_LIKE_TO_CREATE_VOLUME',
          actions: [
            {
              handler: () => this.showCreationDialog(),
              text: 'COMMON.YES'
            },
            { text: 'COMMON.NO' },
            {
              handler: () => this.userService.writeTag(askToCreateVolume, 'false')
                .subscribe(),
              text: 'SUGGESTION_DIALOG.NO_DONT_ASK'
            }
          ],
          disableClose: false,
          width: '320px'
        });

      });
  }

  private updateZones(): Observable<void> {
    return this.zoneService.getList().map(zones => {
      this.zones = zones;
    });
  }

  private updateVolumeList(): Observable<void> {
    let diskOfferings: Array<DiskOffering>;

    return this.diskOfferingService.getList({ type: VolumeType.DATADISK })
      .switchMap((offerings: Array<DiskOffering>) => {
        diskOfferings = offerings;
        return this.volumeService.getSpareList();
      })
      .map(volumes => {
        this.volumes = volumes
          .map(volume => {
            volume.diskOffering = diskOfferings.find(
              offering => offering.id === volume.diskOfferingId);
            return volume;
          });

        this.visibleVolumes = volumes;
        if (this.volumes.length) {
          this.update();
        } else {
          this.showSuggestionDialog();
        }
      });
  }
}
