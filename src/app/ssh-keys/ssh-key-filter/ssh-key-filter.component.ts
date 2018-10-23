import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grouping } from '../../shared/models';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';

@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html',
})
export class ShhKeyFilterComponent implements OnInit {
  @Input()
  public accounts: Account[];
  @Input()
  public selectedAccountIds: string[] = [];
  @Input()
  public selectedGroupings: Grouping[] = [];
  @Input()
  public groupings: Grouping[];
  @Output()
  public groupingsChanged = new EventEmitter<Grouping[]>();
  @Output()
  public accountsChanged = new EventEmitter<string[]>();

  public ngOnInit() {
    this.groupings = reorderAvailableGroupings(this.groupings, this.selectedGroupings);
  }
}
