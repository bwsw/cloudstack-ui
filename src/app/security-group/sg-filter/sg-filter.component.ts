import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';


export interface SecurityGroupFilter {
  viewMode: SecurityGroupViewMode;
}

export enum SecurityGroupViewMode {
  Templates = 'templates',
  Shared = 'shared'
}

@Component({
  selector: 'cs-sg-filter',
  templateUrl: 'sg-filter.component.html',
  styleUrls: ['sg-filter.component.scss']
})
export class SgFilterComponent {
  @Input() public viewMode: SecurityGroupViewMode;
  @Output() public updateFilters = new EventEmitter<SecurityGroupFilter>();

  private filtersKey = 'securityGroupFilters';
  private filterService = new FilterService(
    {
      viewMode: {
        type: 'string',
        options: [SecurityGroupViewMode.Templates, SecurityGroupViewMode.Shared]
      }
    },
    this.router,
    this.storageService,
    this.filtersKey,
    this.activatedRoute
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: LocalStorageService
  ) {}

  public get mode(): number {
    const modeIndices = {
      [SecurityGroupViewMode.Templates]: 0,
      [SecurityGroupViewMode.Shared]: 1
    };

    return modeIndices[this.viewMode];
  }

  public setMode(index: SecurityGroupViewMode): void {
    const modes = {
      0: SecurityGroupViewMode.Templates,
      1: SecurityGroupViewMode.Shared
    };

    this.viewMode = modes[index];
    this.storageService.write('securityGroupDisplayMode', this.viewMode);
    this.update();
  }

  public update(): void {
    this.updateFilters.emit({
      viewMode: this.viewMode
    });

    this.filterService.update(this.filtersKey, {
      viewMode: this.viewMode
    });
  }
}
