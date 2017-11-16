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

  public get SecurityGroupViewMode() {
    return SecurityGroupViewMode;
  }
}
