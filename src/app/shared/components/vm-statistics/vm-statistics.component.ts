import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import {
  ResourcesData,
  ResourceStats,
  ResourceUsageService
} from '../../services/resource-usage.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Utils } from '../../services/utils.service';

const showStatistics = 'showStatistics';
const statisticsMode = 'statisticsMode';

const enum StatsMode {
  Used,
  Free
}

interface StatsItem {
  header: string;
  bars: Array<StatsBar>;
}

interface StatsBar {
  title: string;
  value(): Observable<string>;
  progress(): number;
}

@Component({
  selector: 'cs-vm-statistics',
  templateUrl: 'vm-statistics.component.html',
  styleUrls: ['vm-statistics.component.scss']
})
export class VmStatisticsComponent implements OnInit {
  public fetching = false;
  public resourceUsage: ResourceStats;
  public isOpen = true;
  public mode = StatsMode.Used;
  private wasOpened = false;

  public statsList: Array<StatsItem> = [
    {
      header: 'VM_PAGE.RESOURCE_USAGE.VMS',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.NUMBER_OF_VMS',
          value: () => this.getStatsStringFor('instances'),
          progress: () => this.progressFor('instances')
        }
      ]
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.COMPUTATIONAL_RESOURCES',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.CPUS',
          value: () => this.getStatsStringFor('cpus'),
          progress: () => this.progressFor('cpus')
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.RAM',
          value: () => this.memory,
          progress: () => this.progressFor('memory')
        }
      ]
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.VOLUMES',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.VOLUMES',
          value: () => this.getStatsStringFor('volumes'),
          progress: () => this.progressFor('volumes')
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.SNAPSHOTS',
          value: () => this.getStatsStringFor('snapshots'),
          progress: () => this.progressFor('snapshots')
        }
      ]
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.STORAGE',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.PRIMARY',
          value: () => this.primaryStorage,
          progress: () => this.progressFor('primaryStorage')
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.SECONDARY',
          value: () => this.secondaryStorage,
          progress: () => this.progressFor('secondaryStorage')
        }
      ]
    }
  ];

  constructor(
    private translateService: TranslateService,
    private storageService: LocalStorageService,
    private resourceUsageService: ResourceUsageService
  ) {
    this.resourceUsage = new ResourceStats();
  }

  public ngOnInit(): void {
    const shouldShowStatistics = this.storageService.read(showStatistics);
    // no such key in the local storage, just show the stats
    if (!shouldShowStatistics) {
      this.updateStats();
    } else {
      this.isOpen = shouldShowStatistics === 'true';
      if (this.isOpen) {
        this.wasOpened = true;
        this.updateStats();
      }
    }

    const modeRaw = this.storageService.read(statisticsMode);
    switch (parseInt(modeRaw, 10)) {
      case StatsMode.Free:
        this.mode = StatsMode.Free;
        break;
      case StatsMode.Used:
      default:
        this.mode = StatsMode.Used;
    }
  }

  public switchMode() {
    this.mode = this.mode === StatsMode.Used ? StatsMode.Free : StatsMode.Used;
    this.storageService.write(statisticsMode, this.mode.toString());
  }

  public getPercents(value: number, max: number): string {
    return this.getProgress(value, max).toFixed(0);
  }

  public getStatsString(value: number, max: number, units?: string): Observable<string> {
    if (max > 0) {
      return this.getStatsStringWithRestrictions(value, max, units);
    }

    return this.getStatsStringWithNoRestrictions(value, units);
  }

  public getStatsStringFor(resource: keyof ResourcesData, units?: string): Observable<string> {
    const consumed = this.resourceUsage[this.getModeKey()][resource];
    const max = this.resourceUsage.max[resource];
    return this.getStatsString(consumed, max, units);
  }

  public get memory(): Observable<string> {
    const consumed = Utils.divide(
      this.resourceUsage[this.getModeKey()].memory,
      2,
      '10',
      '1'
    );
    const max = Utils.divide(
      this.resourceUsage.max.memory,
      2,
      '10',
      '1'
    );

    return this.translateService
      .get('UNITS.GB')
      .switchMap(gb => this.getStatsString(consumed as number, max as number, gb));
  }

  public get primaryStorage(): Observable<string> {
    return this.translateService
      .get('UNITS.GB')
      .switchMap(gb =>
        this.getStatsStringFor(
          'primaryStorage',
          gb
        )
      );
  }

  public get secondaryStorage(): Observable<string> {
    return this.translateService
      .get('UNITS.GB')
      .switchMap(gb =>
        this.getStatsStringFor(
          'secondaryStorage',
          gb
        )
      );
  }

  public progressFor(resource: keyof ResourcesData): number {
    return this.getProgress(
      this.resourceUsage[this.getModeKey()][resource],
      this.resourceUsage.max[resource],
    );
  }

  public handleCollapse(e: Event): void {
    e.stopPropagation();
    this.isOpen = !this.isOpen;

    if (this.isOpen && !this.wasOpened) {
      this.wasOpened = true;
      this.updateStats();
    }

    this.storageService.write(showStatistics, this.isOpen.toString());
  }

  public updateStats(): void {
    this.fetching = true;
    this.resourceUsageService.getResourceUsage().subscribe(result => {
      // to keep progress bar animation
      setTimeout(() => (this.resourceUsage = result));
      this.fetching = false;
    });
  }

  private getProgress(consumed: number, max: number): number {
    return consumed / max * 100 || 0;
  }

  private getModeKey(): keyof ResourceStats {
    return this.mode === StatsMode.Used ? 'consumed' : 'available';
  }

  private getStatsStringWithRestrictions(value: number, max: number, units?: string): Observable<string> {
    const percents = this.getPercents(value, max);
    return Observable.of(`${value}/${max} ${units || ''} (${percents}%)`);
  }

  private getStatsStringWithNoRestrictions(value: number, units?: string): Observable<string> {
    if (this.mode === StatsMode.Free) {
      return Observable.of ('∞');
    }

    if (this.mode === StatsMode.Used) {
      return Observable.of(`${value} ${units || ''}`);
    }
  }
}
