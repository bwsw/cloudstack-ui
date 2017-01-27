import { Component, OnInit, Inject } from '@angular/core';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';
import { IStorageService } from '../../shared/services/storage.service';


const localStorageKey = 'showStatistics';

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
    const showStatistics = this.storageService.read(localStorageKey);
    // no such key in the local storage, just show the stats
    if (!showStatistics) {
      this.updateStats();
      return;
    }

    this.isOpen = showStatistics === 'true';
    if (this.isOpen) {
      this.wasOpened = true;
      this.updateStats();
    }
  }

  public handleCollapse(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen && !this.wasOpened) {
      this.wasOpened = true;
      this.updateStats();
    }

    this.storageService.write(localStorageKey, this.isOpen.toString());
  }

  public updateStats(): void {
    this.resourceUsageService.getResourceUsage()
      .subscribe(result => {
        this.resourceUsage = result;
      });
  }
}
