import { Component, Input, OnChanges, Type } from '@angular/core';
import { BaseModel } from '../../models/base.model';
import { Grouping } from '../../models/grouping.model';
import * as groupBy from 'lodash/groupBy';

@Component({
  selector: 'cs-grouped-list',
  templateUrl: 'grouped-list.component.html',
  styleUrls: ['grouped-list.component.scss'],
})
export class GroupedListComponent implements OnChanges {
  @Input()
  public component: Type<any>;
  @Input()
  public list: BaseModel[];
  @Input()
  public level = 0;
  @Input()
  public groupings: Grouping[];
  @Input()
  dynamicInputs: { [k: string]: any } = {};
  @Input()
  dynamicOutputs: { [k: string]: Function } = {};
  public tree: { items?; name? }[];

  readonly emptyName = 'COMMON.EMPTY_GROUP_NAME';

  public ngOnChanges(changes): void {
    this.updateTree();
  }

  public leafInputs(item: any) {
    return { ...this.dynamicInputs, item };
  }

  protected updateTree(): void {
    const groupings = this.groupings;
    if (groupings.length && this.level < groupings.length) {
      const groups = groupBy(this.list, groupings[this.level].selector);
      this.tree = Object.keys(groups)
        .map(gn => {
          return {
            name: groupings[this.level].name(groups[gn][0]) || this.emptyName,
            items: groups[gn],
          };
        })
        .sort((group1, group2) => this.sortGroups(group1, group2));
    } else {
      this.tree = [{ items: this.list }];
    }
  }

  protected sortGroups(group1, group2) {
    return group1.name.localeCompare(group2.name);
  }
}
