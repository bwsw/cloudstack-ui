import { Component, OnInit, Inject } from '@angular/core';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';
import { IStorageService } from '../../shared/services/storage.service';


const showStatistics = 'showStatistics';

@Component({
  selector: 'cs-vm-statistics',
  templateUrl: 'vm-statistics.component.html',
  styleUrls: ['vm-statistics.component.scss']
})
export class VmStatisticsComponent implements OnInit {
  public resourceUsage: ResourceStats;
  public isOpen = true;
  private wasOpened = false;

  constructor(
    private resourceUsageService: ResourceUsageService,
    @Inject('IStorageService') protected storageService: IStorageService,
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
    this.resourceUsageService.getResourceUsage()
      .subscribe(result => {
        this.resourceUsage = result;
      });
  }
}
