import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import {
  ResourcesData,
  ResourceStats,
  ResourceUsageService
} from '../../services/resource-usage.service';
import { StorageService } from '../../services/storage.service';
import { UtilsService } from '../../services/utils.service';

const showStatistics = 'showStatistics';

const enum StatsMode {
  Used,
  Free
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
  private wasOpened = false;
  private mode = StatsMode.Free;

  public list = [
    {
      header: 'VMS',
      bars: [
        {
          title: 'DEPLOYED_STATS',
          value: () => this.instances,
          progress: () => this.progressFor('instances')
        }
      ]
    },
    {
      header: 'COMPUTATIONAL_RESOURCES',
      bars: [
        {
          title: 'CPUS',
          value: () => this.cpus,
          progress: () => this.progressFor('cpus')
        },
        {
          title: 'RAM',
          value: () => this.memory,
          progress: () => this.progressFor('memory')
        }
      ]
    },
    {
      header: 'VOLUMES',
      bars: [
        {
          title: 'VOLUMES',
          value: () => this.volumes,
          progress: () => this.progressFor('volumes')
        },
        {
          title: 'SNAPSHOTS',
          value: () => this.snapshots,
          progress: () => this.progressFor('snapshots')
        }
      ]
    },
    {
      header: 'STORAGE',
      bars: [
        {
          title: 'PRIMARY_(STORAGE)',
          value: () => this.primaryStorage,
          progress: () => this.progressFor('primaryStorage')
        },
        {
          title: 'SECONDARY_(STORAGE)',
          value: () => this.secondaryStorage,
          progress: () => this.progressFor('secondaryStorage')
        }
      ]
    }
  ];

  constructor(
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private resourceUsageService: ResourceUsageService
  ) {
    this.resourceUsage = new ResourceStats();
  }

  public ngOnInit(): void {
    const shouldShowStatistics = this.storageService.read(showStatistics);
    // no such key in the local storage, just show the stats
    if (!shouldShowStatistics) {
      this.updateStats();
      return;
    }

    this.isOpen = shouldShowStatistics === 'true';
    if (this.isOpen) {
      this.wasOpened = true;
      this.updateStats();
    }
  }

  public switchMode() {
    if (this.mode === StatsMode.Used) {
      this.mode = StatsMode.Free;
    } else {
      this.mode = StatsMode.Used;
    }
  }

  public getPercents(consumed: number, max: number): string {
    return this.getProgress(consumed, max).toFixed(0);
  }

  public getStatsString(consumed: number, max: number, units?: string): Observable<string> {
    const progress = this.mode === StatsMode.Used ? consumed : max - consumed;
    if (max === -1) {
      return Observable.of(`${progress} ${units || ''}`);
    } else {
      return Observable.of(`${progress}/${max} ${units || ''} (${this.getPercents(
        consumed,
        max
      )}%)`);
    }
  }

  public get instances() {
    return this.getStatsString(
      this.resourceUsage.consumed.instances,
      this.resourceUsage.max.instances
    );
  }

  public get cpus() {
    return this.getStatsString(
      this.resourceUsage.consumed.cpus,
      this.resourceUsage.max.cpus
    );
  }

  public get memory(): Observable<string> {
    const consumed = this.utilsService.divide(
      this.resourceUsage.consumed.memory,
      2,
      '10',
      '1'
    );
    const max = this.utilsService.divide(
      this.resourceUsage.max.memory,
      2,
      '10',
      '1'
    );

    return this.translateService
      .get('GB')
      .switchMap(gb => this.getStatsString(consumed as number, max as number, gb));
  }

  public get volumes() {
    return this.getStatsString(
      this.resourceUsage.consumed.volumes,
      this.resourceUsage.max.volumes
    );
  }

  public get snapshots() {
    return this.getStatsString(
      this.resourceUsage.consumed.snapshots,
      this.resourceUsage.max.snapshots
    );
  }

  public get primaryStorage(): Observable<string> {
    return this.translateService
      .get('GB')
      .switchMap(gb =>
        this.getStatsString(
          this.resourceUsage.consumed.primaryStorage,
          this.resourceUsage.max.primaryStorage,
          gb
        )
      );
  }

  public get secondaryStorage(): Observable<string> {
    return this.translateService
      .get('GB')
      .switchMap(gb =>
        this.getStatsString(
          this.resourceUsage.consumed.secondaryStorage,
          this.resourceUsage.max.secondaryStorage,
          gb
        )
      );
  }

  public progressFor(resource: keyof ResourcesData): number {
    return this.getProgress(
      this.resourceUsage.consumed[resource],
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
    const progress = consumed / max * 100 || 0;
    return this.mode === StatsMode.Used ? progress : 100 - progress;
  }
}
