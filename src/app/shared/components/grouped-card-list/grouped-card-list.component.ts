import { ChangeDetectionStrategy, Component, Input, OnChanges, Type } from '@angular/core';
import groupBy = require('lodash/groupBy');

@Component({
  selector: 'cs-grouped-card-list',
  templateUrl: './grouped-card-list.component.html',
  styleUrls: ['./grouped-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupedCardListComponent implements OnChanges {
  @Input() public component: Type<any>;
  @Input() public list: Array<any>;
  @Input() public level = 0;
  @Input() public groupings: Array<any>;
  @Input() dynamicInputs: { [k: string]: any } = {};
  @Input() dynamicOutputs: { [k: string]: Function } = {};

  public tree: Array<{ items?, name? }>;

  ngOnChanges(): void {
    this.updateTree();
  }

  public leafInputs(item: any) {
    return { ...this.dynamicInputs, item };
  }

  private updateTree(): void {
    const groupings = this.groupings;
    if (groupings.length && this.level < groupings.length) {
      const groups = groupBy(this.list, groupings[this.level].selector);
      this.tree = Object.keys(groups).map(gn => {
        return {
          name: groupings[this.level].name(groups[gn][0]),
          items: groups[gn]
        };
      });
    } else {
      this.tree = [{ items: this.list }];
    }
  }
}
