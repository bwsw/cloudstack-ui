import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GroupedListComponent } from '../../shared/components/grouped-list/grouped-list.component';

import * as groupBy from 'lodash/groupBy';

@Component({
  selector: 'cs-sg-grouped-list',
  templateUrl: '../../shared/components/grouped-list/grouped-list.component.html',
  styleUrls: ['../../shared/components/grouped-list/grouped-list.component.scss']
})
export class SecurityGroupGroupedListComponent extends GroupedListComponent {
  constructor(private translateService: TranslateService) {
    super();
  }

  protected updateTree(): void {
    const groupings = this.groupings;
    if (groupings.length && this.level < groupings.length) {
      const groups = groupBy(this.list, groupings[this.level].selector);
      this.tree = Object.keys(groups).map(gn => {
        return {
          name: groupings[this.level].name(groups[gn][0]),
          items: groups[gn]
        };
      }).sort((group1, group2) => {
        const systemName = this.translateService
          .instant('SECURITY_GROUP_PAGE.LIST.SYSTEM_SECURITY_GROUPS');
        return group1.name === systemName ? -1 : 1;
      });
    } else {
      this.tree = [{ items: this.list }];
    }
  }
}
