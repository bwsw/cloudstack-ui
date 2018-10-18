import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ResourcesData, ResourceStats } from '../../services/resource-usage.service';
import { Utils } from '../../services/utils/utils.service';
import { Account } from '../../models';

const showStatistics = 'showStatistics';
const statisticsMode = 'statisticsMode';
const statisticsType = 'statisticsType';

const enum StatsMode {
  Used,
  Free,
}

const enum StatsType {
  Account,
  Domain,
}

interface StatsItem {
  header: string;
  bars: StatsBar[];
}

interface StatsBar {
  title: string;

  value(): Observable<string>;

  progress(): number;
}

@Component({
  selector: 'cs-vm-statistics',
  templateUrl: 'vm-statistics.component.html',
  styleUrls: ['vm-statistics.component.scss'],
})
export class VmStatisticsComponent implements OnInit, OnChanges {
  @Input()
  public fetching = false;
  @Input()
  public accounts: Account[];
  @Input()
  public user: Account;

  public resourceUsage: ResourceStats;
  public isOpen = true;
  public mode = StatsMode.Used;
  public statsType = StatsType.Account;

  public statsList: StatsItem[] = [
    {
      header: 'VM_PAGE.RESOURCE_USAGE.VMS',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.NUMBER_OF_VMS',
          value: () => this.getStatsStringFor('instances'),
          progress: () => this.progressFor('instances'),
        },
      ],
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.COMPUTATIONAL_RESOURCES',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.CPUS',
          value: () => this.getStatsStringFor('cpus'),
          progress: () => this.progressFor('cpus'),
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.RAM',
          value: () => this.memory,
          progress: () => this.progressFor('memory'),
        },
      ],
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.VOLUMES',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.VOLUMES',
          value: () => this.getStatsStringFor('volumes'),
          progress: () => this.progressFor('volumes'),
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.SNAPSHOTS',
          value: () => this.getStatsStringFor('snapshots'),
          progress: () => this.progressFor('snapshots'),
        },
      ],
    },
    {
      header: 'VM_PAGE.RESOURCE_USAGE.STORAGE',
      bars: [
        {
          title: 'VM_PAGE.RESOURCE_USAGE.PRIMARY',
          value: () => this.primaryStorage,
          progress: () => this.progressFor('primaryStorage'),
        },
        {
          title: 'VM_PAGE.RESOURCE_USAGE.SECONDARY',
          value: () => this.secondaryStorage,
          progress: () => this.progressFor('secondaryStorage'),
        },
      ],
    },
  ];

  private wasOpened = false;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private storageService: LocalStorageService,
  ) {
    this.resourceUsage = new ResourceStats();
  }

  public ngOnInit(): void {
    const shouldShowStatistics = this.storageService.read(showStatistics);
    // no such key in the local storage, just show the stats
    if (!shouldShowStatistics) {
      this.getStats();
    } else {
      this.isOpen = shouldShowStatistics === 'true';
      if (this.isOpen) {
        this.wasOpened = true;
        this.getStats();
      }
    }

    const modeRaw = this.storageService.read(statisticsMode);
    this.mode = parseInt(modeRaw, 10) ? StatsMode.Free : StatsMode.Used;

    const typeRaw = this.storageService.read(statisticsType);
    this.statsType = parseInt(typeRaw, 10) ? StatsType.Domain : StatsType.Account;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.getStats();
  }

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public switchMode() {
    this.mode = this.mode === StatsMode.Used ? StatsMode.Free : StatsMode.Used;
    this.storageService.write(statisticsMode, this.mode.toString());
  }

  public switchType() {
    this.statsType = this.statsType === StatsType.Account ? StatsType.Domain : StatsType.Account;
    this.storageService.write(statisticsType, this.statsType.toString());

    this.getStats();
  }

  public getPercents(value: number, max: number): string {
    return this.getProgress(value, max).toFixed(0);
  }

  public getStatsString(
    value: number,
    max: number,
    units?: string,
    precision?: number,
  ): Observable<string> {
    if (max !== Infinity) {
      return this.getStatsStringWithRestrictions(value, max, units, precision);
    }

    return this.getStatsStringWithNoRestrictions(value, units, precision);
  }

  public getStatsStringFor(resource: keyof ResourcesData, units?: string): Observable<string> {
    const consumed = this.resourceUsage[this.getModeKey()][resource];
    const max = this.resourceUsage.max[resource];
    return this.getStatsString(consumed, max, units);
  }

  public get memory(): Observable<string> {
    const consumed = Utils.divide(this.resourceUsage[this.getModeKey()].memory, 2, 10);
    const max = Utils.divide(this.resourceUsage.max.memory, 2, 10);

    return this.translateService
      .get('UNITS.GB')
      .pipe(switchMap(gb => this.getStatsString(consumed, max, gb, 1)));
  }

  public get primaryStorage(): Observable<string> {
    return this.translateService
      .get('UNITS.GB')
      .pipe(switchMap(gb => this.getStatsStringFor('primaryStorage', gb)));
  }

  public get secondaryStorage(): Observable<string> {
    return this.translateService
      .get('UNITS.GB')
      .pipe(switchMap(gb => this.getStatsStringFor('secondaryStorage', gb)));
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
      this.getStats();
    }

    this.storageService.write(showStatistics, this.isOpen.toString());
  }

  public getStats(): void {
    const forDomain = this.statsType === StatsType.Domain;
    this.resourceUsage = forDomain
      ? ResourceStats.fromAccount(this.accounts)
      : ResourceStats.fromAccount(this.user ? [this.user] : []);
  }

  private getProgress(consumed: number, max: number): number {
    return (consumed / max) * 100 || 0;
  }

  private getModeKey(): keyof ResourceStats {
    return this.mode === StatsMode.Used ? 'consumed' : 'available';
  }

  private getStatsStringWithRestrictions(
    value: number,
    max: number,
    units?: string,
    precision?: number,
  ): Observable<string> {
    const percents = this.getPercents(value, max);
    const val = precision ? value.toFixed(precision) : value;
    const m = precision ? max.toFixed(precision) : max;

    return of(`${val}/${m} ${units || ''} (${percents}%)`);
  }

  private getStatsStringWithNoRestrictions(
    value: number,
    units?: string,
    precision?: number,
  ): Observable<string> {
    if (this.mode === StatsMode.Free) {
      return of('∞');
    }

    if (this.mode === StatsMode.Used) {
      const val = precision ? value.toFixed(precision) : value;
      return of(`${val} ${units || ''}`);
    }
  }
}
