import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SecurityGroupViewMode } from './containers/sg-filter.container';


export interface SecurityGroupFilter {
  viewMode: SecurityGroupViewMode;
  query: string;
  vm: string;
}


@Component({
  selector: 'cs-sg-filter',
  templateUrl: 'sg-filter.component.html',
  styleUrls: ['sg-filter.component.scss']
})
export class SgFilterComponent implements OnChanges {
  @Input() public filters: SecurityGroupFilter;

  @Output() public viewModeChange = new EventEmitter<SecurityGroupViewMode>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public vmChange = new EventEmitter<string>();

  public viewMode: SecurityGroupViewMode;
  public query: string;
  public vm: string;

  public ngOnChanges(changes) {
    if (changes.filters) {
      this.viewMode = this.filters.viewMode;
      this.query = this.filters.query;
      this.vm = this.filters.vm;
    }
  }

  public get mode(): number {
    const modeIndices = {
      [SecurityGroupViewMode.Templates]: 0,
      [SecurityGroupViewMode.Shared]: 1
    };

    return modeIndices[this.viewMode] || 0;
  }

  public setMode(index: SecurityGroupViewMode): void {
    const modes = {
      0: SecurityGroupViewMode.Templates,
      1: SecurityGroupViewMode.Shared
    };

    this.viewMode = modes[index];
    this.viewModeChange.emit(this.viewMode);
  }
}
