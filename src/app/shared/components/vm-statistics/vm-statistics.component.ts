import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ResourceStats, ResourceUsageService } from '../../services/resource-usage.service';
import { StorageService } from '../../services/storage.service';
import { Utils } from '../../services/utils.service';


const showStatistics = 'showStatistics';

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

  constructor(
    private translateService: TranslateService,
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

  public getPercents(consumed: number, max: number): string {
    return this.getProgress(consumed, max).toFixed(0);
  }

  public getStatsString(consumed: number, max: number, units?: string): string {
    if (max === -1) {
      return `${consumed} ${units || ''}`;
    } else {
      return `${consumed}/${max} ${units || ''} (${this.getPercents(consumed, max)}%)`;
    }
  }

  public get instances(): string {
    return this.getStatsString(this.resourceUsage.consumed.instances, this.resourceUsage.max.instances);
  }

  public get cpus(): string {
    return this.getStatsString(this.resourceUsage.consumed.cpus, this.resourceUsage.max.cpus);
  }

  public get memory(): Observable<string> {
    const consumed = Utils.divide(this.resourceUsage.consumed.memory, 2, '10', '1');
    const max = Utils.divide(this.resourceUsage.max.memory, 2, '10', '1');

    return this.translateService.get('GB')
      .map(gb => this.getStatsString(consumed as number, max as number, gb));
  }

  public get volumes(): string {
    return this.getStatsString(this.resourceUsage.consumed.volumes, this.resourceUsage.max.volumes);
  }

  public get snapshots(): string {
    return this.getStatsString(this.resourceUsage.consumed.snapshots, this.resourceUsage.max.snapshots);
  }

  public get primaryStorage(): Observable<string> {
    return this.translateService.get('GB')
      .map(gb => this.getStatsString(
        this.resourceUsage.consumed.primaryStorage,
        this.resourceUsage.max.primaryStorage,
        gb
      ));
  }

  public get secondaryStorage(): Observable<string> {
    return this.translateService.get('GB')
      .map(gb => this.getStatsString(
        this.resourceUsage.consumed.secondaryStorage,
        this.resourceUsage.max.secondaryStorage,
        gb
      ));
  }

  public get progressForInstances(): number {
    return this.getProgress(this.resourceUsage.consumed.instances, this.resourceUsage.max.instances);
  }

  public get progressForCpus(): number {
    return this.getProgress(this.resourceUsage.consumed.cpus, this.resourceUsage.max.cpus);
  }

  public get progressForMemory(): number {
    return this.getProgress(this.resourceUsage.consumed.memory, this.resourceUsage.max.memory);
  }

  public get progressForVolumes(): number {
    return this.getProgress(this.resourceUsage.consumed.volumes, this.resourceUsage.max.volumes);
  }

  public get progressForSnapshots(): number {
    return this.getProgress(this.resourceUsage.consumed.snapshots, this.resourceUsage.max.snapshots);
  }

  public get progressForPrimaryStorage(): number {
    return this.getProgress(this.resourceUsage.consumed.primaryStorage, this.resourceUsage.max.primaryStorage);
  }

  public get progressForSecondaryStorage(): number {
    return this.getProgress(this.resourceUsage.consumed.secondaryStorage, this.resourceUsage.max.secondaryStorage);
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
    this.resourceUsageService.getResourceUsage()
      .subscribe(result => {
        // to keep progress bar animation
        setTimeout(() => this.resourceUsage = result);
        this.fetching = false;
      });
  }

  private getProgress(consumed: number, max: number): number {
    return (consumed / max * 100) || 0;
  }
}
