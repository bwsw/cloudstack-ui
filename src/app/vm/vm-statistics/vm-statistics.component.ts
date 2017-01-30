import { Component, OnInit } from '@angular/core';
import { ResourceUsageService, ResourceStats } from '../../shared/services/resource-usage.service';


@Component({
  selector: 'cs-vm-statistics',
  templateUrl: 'vm-statistics.component.html',
  styleUrls: ['vm-statistics.component.scss']
})
export class VmStatisticsComponent implements OnInit {
  public resourceUsage: ResourceStats;
  public isOpen = true;

  constructor(private resourceUsageService: ResourceUsageService) {
    this.resourceUsage = new ResourceStats();
  }

  public ngOnInit(): void {
    this.updateStats();
  }

  public handleCollapse(e: Event): void {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  public updateStats(): void {
    this.resourceUsageService.getResourceUsage().subscribe(result => {
      this.resourceUsage = result;
    });
  }
}
