import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { DiskOffering, Volume, VolumeType, Zone } from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { filterWithPredicates } from '../../shared/utils/filter';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
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
  providers: [ListService]
})
export class SpareDrivePageComponent extends WithUnsubscribe() implements OnInit, OnDestroy {
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
    public listService: ListService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private userTagService: UserTagService,
    private volumeService: VolumeService,
    private zoneService: ZoneService
  ) {
    super();
  }

  public ngOnInit(): void {
    Observable.merge(
      this.volumeService.onVolumeAttachment.takeUntil(this.onDestroy)
        .do(e => {
          if (this.listService.isSelected(e.volumeId)) {
            this.listService.deselectItem();
          }
        }),
      this.volumeService.onVolumeCreated.takeUntil(this.onDestroy),
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

    this.visibleVolumes = filterWithPredicates(
      this.volumes,
      [
        this.filterVolumesByZones(selectedZones),
        this.filterVolumesBySpare(spareOnly),
        this.filterVolumesBySearch()
      ]);
  }

  public updateGroupings(): void {
    this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);
  }

  public filterVolumesByZones(selectedZones: Array<Zone>): (volume) => boolean {
    return (volume) => {
      if (selectedZones.length) {
        return selectedZones.some(z => volume.zoneId === z.id);
      } else {
        return true;
      }
    };
  }

  public filterVolumesBySpare(spareOnly = false): (volume) => boolean {
    return (volume) => {
      if (spareOnly) {
        return volume.isSpare;
      } else {
        return true;
      }
    };
  }

  public filterVolumesBySearch(): (volume) => boolean {
    return (volume) => {
      if (!this.query) {
        return true;
      }

      const queryLower = this.query.toLowerCase();
      return volume.name.toLowerCase().includes(queryLower)
        || volume.description.toLowerCase().includes(queryLower);
    };
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private onVolumeUpdated(): void {
    this.updateVolumeList().subscribe(() => this.filter());
  }

  private get shouldShowSuggestionDialog(): boolean {
    return !this.volumes.length && !this.isCreateVolumeInUrl;
  }

  private get isCreateVolumeInUrl(): boolean {
    return this.activatedRoute.children.length
      && this.activatedRoute.children[0].snapshot.url[0].path === 'create';
  }

  private showSuggestionDialog(): void {
    if (this.isCreateVolumeInUrl) {
      return;
    }

    this.userTagService.getAskToCreateVolume()
      .subscribe(tag => {
        if (tag === false) {
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
              handler: () => this.userTagService.setAskToCreateVolume(false).subscribe(),
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
        }

        if (this.shouldShowSuggestionDialog) {
          this.showSuggestionDialog();
        }
      });
  }
}
