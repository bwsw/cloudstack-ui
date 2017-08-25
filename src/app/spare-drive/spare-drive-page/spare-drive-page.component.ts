import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { DiskOffering, Volume, VolumeType, Zone } from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveCreationComponent } from '../spare-drive-creation/spare-drive-creation.component';
import { SpareDriveFilter } from '../spare-drive-filter/spare-drive-filter.component';


export interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

@Component({
  selector: 'cs-spare-drive-page',
  templateUrl: 'spare-drive-page.component.html',
  styleUrls: ['spare-drive-page.component.scss'],
  providers: [ListService]
})
export class SpareDrivePageComponent implements OnInit, OnDestroy {
  @HostBinding('class.detail-list-container') public detailListContainer = true;
  public volumes: Array<Volume>;
  public zones: Array<Zone>;
  public visibleVolumes: Array<Volume>;

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'SPARE_DRIVE_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: Volume) => item.zoneId,
      name: (item: Volume) => item.zoneName
    }
  ];
  public query: string;

  public filterData: any;

  private onDestroy = new Subject();

  constructor(
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private listService: ListService,
    private userTagService: UserTagService,
    private volumeService: VolumeService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    this.listService.onAction
      .takeUntil(this.onDestroy)
      .subscribe(() => this.showCreationDialog());

    Observable.merge(
      this.volumeService.onVolumeAttachment.takeUntil(this.onDestroy)
        .do(e => {
          if (this.listService.isSelected(e.volumeId)) {
            this.listService.deselectItem();
          }
        }),
      this.volumeService.onVolumeResized.takeUntil(this.onDestroy),
      this.volumeService.onVolumeRemoved.takeUntil(this.onDestroy),
      this.volumeService.onVolumeTagsChanged.takeUntil(this.onDestroy)
    )
      .subscribe(() => this.onVolumeUpdated());

    Observable.forkJoin(
      this.updateVolumeList(),
      this.updateZones()
    )
      .subscribe(() => this.filter());
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  public updateFiltersAndFilter(filterData: SpareDriveFilter): void {
    this.filterData = filterData;
    this.filter();
  }

  public filter(): void {
    if (!this.volumes || !this.volumes.length) {
      return;
    }

    if (!this.filterData) {
      this.visibleVolumes = this.volumes;
      return;
    }

    this.updateGroupings();

    const { selectedZones, spareOnly, query } = this.filterData;
    this.query = query;

    this.visibleVolumes = this.filterVolumesByZones(this.volumes, selectedZones);
    this.visibleVolumes = this.filterVolumesBySpare(this.visibleVolumes, spareOnly);
    this.visibleVolumes = this.filterVolumesBySearch(this.visibleVolumes);
  }

  public updateGroupings(): void {
    this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);
  }

  public filterVolumesByZones(volumes: Array<Volume>, selectedZones: Array<Zone>): Array<Volume> {
    if (selectedZones.length) {
      return volumes.filter(volume => selectedZones.some(z => volume.zoneId === z.id));
    } else {
      return volumes;
    }
  }

  public filterVolumesBySpare(volumes: Array<Volume>, spareOnly = false): Array<Volume> {
    if (spareOnly) {
      return this.volumeService.getSpareListSync(this.volumes);
    } else {
      return volumes;
    }
  }

  public filterVolumesBySearch(volumes: Array<Volume>): Array<Volume> {
    if (!this.query) {
      return volumes;
    }
    const queryLower = this.query.toLowerCase();
    return volumes.filter(volume => {
      return volume.name.toLowerCase().includes(queryLower) ||
             volume.description.toLowerCase().includes(queryLower);
    });
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SpareDriveCreationComponent,
      classes: 'spare-drive-creation-dialog',
      clickOutsideToClose: false
    })
      .switchMap(res => res.onHide())
      .subscribe((volume: Volume) => {
        if (volume) {
          this.volumes.push(volume);
          this.filter();
        }
      });
  }

  private onVolumeUpdated(): void {
    this.updateVolumeList().subscribe(() => this.filter());
  }

  private showSuggestionDialog(): void {
    this.userTagService.getAskToCreateVolume()
      .subscribe(tag => {
        if (tag === false) {
          return;
        }

        this.dialogService.showDialog({
          message: 'SUGGESTION_DIALOG.WOULD_YOU_LIKE_TO_CREATE_VOLUME',
          actions: [
            {
              handler: () => this.showCreationDialog(),
              text: 'COMMON.YES'
            },
            { text: 'COMMON.NO' },
            {
              handler: () => this.userTagService.setAskToCreateVolume(false).subscribe(),
              text: 'SUGGESTION_DIALOG.NO_DONT_ASK'
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
    return this.zoneService.getList().map(zones => {
      this.zones = zones;
    });
  }

  private updateVolumeList(): Observable<void> {
    let diskOfferings: Array<DiskOffering>;

    return this.diskOfferingService.getList({ type: VolumeType.DATADISK })
      .switchMap((offerings: Array<DiskOffering>) => {
        diskOfferings = offerings;
        return this.volumeService.getList();
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
          this.filter();
        } else {
          this.showSuggestionDialog();
        }
      });
  }
}
