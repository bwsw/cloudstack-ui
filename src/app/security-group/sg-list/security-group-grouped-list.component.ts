import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GroupedListComponent } from '../../shared/components/grouped-list/grouped-list.component';

@Component({
  selector: 'cs-sg-grouped-list',
  templateUrl: '../../shared/components/grouped-list/grouped-list.component.html',
  styleUrls: ['../../shared/components/grouped-list/grouped-list.component.scss'],
})
export class SecurityGroupGroupedListComponent extends GroupedListComponent {
  constructor(private translateService: TranslateService) {
    super();
  }

  protected sortGroups(group1, group2) {
    const systemName = this.translateService.instant(
      'SECURITY_GROUP_PAGE.LIST.SYSTEM_SECURITY_GROUPS',
    );
    return group1.name === systemName ? -1 : 1;
  }
}
