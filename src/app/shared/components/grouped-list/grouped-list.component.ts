import {
  Component,
  Input,
  OnChanges,
  Type
} from '@angular/core';
import * as groupBy from 'lodash/groupBy';
import { Grouping } from '../../models/grouping.model';
import { BaseModelInterface } from '../../models/base.model';

@Component({
  selector: 'cs-grouped-list',
  templateUrl: 'grouped-list.component.html',
  styleUrls: ['grouped-list.component.scss']
})
export class GroupedListComponent implements OnChanges {
  @Input() public component: Type<any>;
  @Input() public list: Array<BaseModelInterface>;
  @Input() public level = 0;
  @Input() public groupings: Array<Grouping>;
  @Input() dynamicInputs: { [k: string]: any } = {};
  @Input() dynamicOutputs: { [k: string]: Function } = {};

  public tree: Array<{ items?, name? }>;

  ngOnChanges(changes): void {
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
