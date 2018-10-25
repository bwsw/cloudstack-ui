import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { getType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { SecurityGroupCardItemComponent } from '../sg-list-item/card-item/security-group-card-item.component';
import { SecurityGroupRowItemComponent } from '../sg-list-item/row-item/security-group-row-item.component';
import { ListService } from '../../shared/components/list/list.service';
import { SecurityGroupViewMode } from '../sg-view-mode';
import { VirtualMachine } from '../../vm';
import { NgrxEntities } from '../../shared/interfaces';

@Component({
  selector: 'cs-security-group-list',
  templateUrl: 'security-group-list.component.html',
})
export class SecurityGroupListComponent implements OnChanges {
  @Input()
  public securityGroups: SecurityGroup[];
  @Input()
  public query: string;
  @Input()
  public mode: ViewMode;
  @Input()
  public viewMode: SecurityGroupViewMode;
  @Input()
  public vmList: NgrxEntities<VirtualMachine>;
  public groupings = [];

  public inputs;
  public outputs;

  constructor(private translateService: TranslateService, public listService: ListService) {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: SecurityGroup) => this.listService.isSelected(item.id),
      vmList: this.vmList,
    };

    this.outputs = {
      onClick: this.selectSecurityGroup.bind(this),
    };
  }

  public ngOnChanges(changes) {
    this.groupings =
      this.viewMode === SecurityGroupViewMode.Templates
        ? [
            {
              key: 'types',
              label: 'SECURITY_GROUP_PAGE.FILTERS.GROUP_BY_TYPES',
              selector: getType,
              name: (item: SecurityGroup) => {
                switch (getType(item)) {
                  case SecurityGroupType.PredefinedTemplate: {
                    return this.translateService.instant(
                      'SECURITY_GROUP_PAGE.LIST.SYSTEM_SECURITY_GROUPS',
                    );
                  }
                  case SecurityGroupType.CustomTemplate: {
                    return this.translateService.instant(
                      'SECURITY_GROUP_PAGE.LIST.CUSTOM_SECURITY_GROUPS',
                    );
                  }
                  default:
                    break;
                }
              },
            },
          ]
        : [];

    if (changes['vmList']) {
      this.inputs.vmList = this.vmList;
    }
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX
      ? SecurityGroupCardItemComponent
      : SecurityGroupRowItemComponent;
  }

  public selectSecurityGroup(securityGroup: SecurityGroup): void {
    this.listService.showDetails(securityGroup.id);
  }
}
