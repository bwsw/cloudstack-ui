import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import {
  DiskOffering,
  Volume,
  VolumeType,
  Zone
} from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveCreationComponent } from '../spare-drive-creation/spare-drive-creation.component';


const spareDriveListFilters = 'spareDriveListFilters';

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
    private diskOfferingService: DiskOfferingService,
    private listService: ListService,
    private userTagService: UserTagService,
    private volumeService: VolumeService,
    private zoneService: ZoneService,
    private localStorage: LocalStorageService
  ) {
  }

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
      this.volumeService.onVolumeRemoved.takeUntil(this.onDestroy)
    )
      .subscribe(() => this.onVolumeUpdated());



    Observable.forkJoin(
      this.updateVolumeList(),
      this.updateZones()
    )
      .subscribe(() => this.initFilters());
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
          this.update();
        }
      });
  }

  private onVolumeUpdated(): void {
    this.updateVolumeList().subscribe();
    this.update();
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
