import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { DiskOffering, Volume, VolumeType, Zone } from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { filterWithPredicates } from '../../shared/utils/filter';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VolumeFilter } from '../volume-filter/volume-filter.component';
import { volumeTypeNames } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';
import { DomainService } from '../../shared/services/domain.service';
import { Domain } from '../../shared/models/domain.model';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';


export interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

@Component({
  selector: 'cs-volume-page',
  templateUrl: 'volume-page.component.html',
  providers: [ListService]
})
export class VolumePageComponent extends WithUnsubscribe() implements OnInit {
  public volumes: Array<Volume>;
  public zones: Array<Zone>;
  public visibleVolumes: Array<Volume>;

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: Volume) => item.zoneId,
      name: (item: Volume) => item.zoneName
    },
    {
      key: 'types',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_TYPES',
      selector: (item: Volume) => item.type,
      name: (item: Volume) => volumeTypeNames[item.type]
    },
    {
      key: 'accounts',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: Volume) => item.account,
      name: (item: Volume) => `${this.getDomain(item.domainid)}${item.account}` || `${item.domain}/${item.account}`,
    }
  ];
  public query: string;

  public filterData: any;
  public domainList: Array<Domain>;
  public hasVm: boolean;

  constructor(
    public listService: ListService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private userTagService: UserTagService,
    private domainService: DomainService,
    private volumeService: VolumeService,
    private zoneService: ZoneService,
    private authService: AuthService,
    private vmService: VmService) {
    super();
    if (!this.authService.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    } else {
      this.getDomainList();
    }
  }

  public ngOnInit(): void {
    this.getVmInfo();
    Observable.merge(
      this.volumeService.onVolumeAttachment.takeUntil(this.unsubscribe$)
        .do(e => {
          if (this.listService.isSelected(e.volumeId)) {
            this.listService.deselectItem();
          }
        }),
      this.volumeService.onVolumeCreated.takeUntil(this.unsubscribe$),
      this.volumeService.onVolumeResized.takeUntil(this.unsubscribe$),
      this.volumeService.onVolumeRemoved.takeUntil(this.unsubscribe$),
      this.volumeService.onVolumeTagsChanged.takeUntil(this.unsubscribe$)
    )
      .subscribe(() => this.onVolumeUpdated());

    Observable.forkJoin(
      this.updateVolumeList(),
      this.updateZones()
    )
      .subscribe(() => this.filter());
  }

  public updateFiltersAndFilter(filterData: VolumeFilter): void {
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

    const { selectedZones, selectedTypes, spareOnly, query, accounts } = this.filterData;
    this.query = query;

    this.visibleVolumes = filterWithPredicates(
      this.volumes,
      [
        this.filterVolumesByZones(selectedZones),
        this.filterVolumesByTypes(selectedTypes),
        this.filterVolumesBySpare(spareOnly),
        this.filterVolumesBySearch()
      ]
    );
    this.visibleVolumes = this.filterByAccount(this.visibleVolumes, accounts);
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

  public filterVolumesByTypes(selectedTypes: Array<VolumeType>): (volume) => boolean {
    return (volume) => {
      if (selectedTypes.length) {
        return selectedTypes.some(type => volume.type === type);
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

  public activate() {
    if (this.hasVm) {
      this.showCreationDialog();
    } else {
      return this.dialogService.confirm({
        message: 'DIALOG_MESSAGES.VOLUME.CONFIRM_CREATION',
        confirmText: 'COMMON.CONTINUE',
        declineText: 'COMMON.CANCEL'
      })
        .subscribe((res) => {
          if (res) {
            this.showCreationDialog();
          }
        });
    }
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private getDomainList() {
    this.domainService.getList().subscribe(domains => {
      this.domainList = domains;
    });
  }

  private getDomain(domainId: string) {
    const domain = this.domainList && this.domainList.find(d => d.id === domainId);
    return domain ? domain.getPath() : '';
  }

  private filterByAccount(volumes: Array<Volume>, accounts = []) {
    return !accounts.length
      ? volumes
      : volumes.filter(volume =>
        accounts.find(
          account => account.name === volume.account && account.domainid === volume.domainid));
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
              handler: () => this.activate(),
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

  private getVmInfo() {
    this.vmService.getListWithDetails().subscribe((res: VirtualMachine[]) => {
      return res.length === 0 ? this.hasVm = false : this.hasVm = true;
    });
  }
}
