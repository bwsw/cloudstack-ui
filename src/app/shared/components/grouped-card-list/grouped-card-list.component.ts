import { Component, Input, OnInit, Type } from '@angular/core';
import groupBy = require('lodash/groupBy');

@Component({
  selector: 'cs-grouped-card-list',
  templateUrl: './grouped-card-list.component.html',
  styleUrls: ['./grouped-card-list.component.scss']
})
export class GroupedCardListComponent implements OnInit {
  @Input() public component: Type<any>;
  @Input() public list: Array<any>;
  @Input() public groups: Array<any>;
  @Input() dynamicInputs: { [k: string]: any } = {};
  @Input() dynamicOutputs: { [k: string]: Function } = {};

  public tree: Array<{ items?, name? }>;

  ngOnInit(): void {
    this.updateTree();
  }

  public leafInputs(item: any) {
    return { ...this.dynamicInputs, item };
  }

  private updateTree(): void {
    if (this.groups.length) {
      const groups = groupBy(this.list, this.groups[0].selector);
      this.tree = Object.keys(groups).map(gn => {
        return {
          name: this.groups[0].name(groups[gn][0]),
          items: groups[gn]
        };
      });
    } else {
      this.tree = [{ items: this.list }];
    }
  }
}
