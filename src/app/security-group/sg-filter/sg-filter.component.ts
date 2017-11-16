import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecurityGroupViewMode } from './containers/sg-filter.container';


export interface SecurityGroupFilter {
  viewMode: SecurityGroupViewMode;
  query: string;
}


@Component({
  selector: 'cs-sg-filter',
  templateUrl: 'sg-filter.component.html',
  styleUrls: ['sg-filter.component.scss']
})
export class SgFilterComponent {
  @Output() public viewModeChange = new EventEmitter<SecurityGroupViewMode>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public vmChange = new EventEmitter<string>();

  public viewMode: SecurityGroupViewMode;
  public query: string;

  @Input()
  public set filters(filter: SecurityGroupFilter) {
    this.viewMode = filter.viewMode;
    this.query = filter.query;
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
