import {
  OnChanges,
  Type
} from '@angular/core';
import * as groupBy from 'lodash/groupBy';

export class BaseGroupedComponent implements OnChanges {
 public component: Type<any>;
  public list: Array<any>;
  public level = 0;
  public groupings: Array<any>;
  dynamicInputs: { [k: string]: any } = {};
  dynamicOutputs: { [k: string]: Function } = {};

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
