import { Component, Input, OnChanges } from '@angular/core';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { SecurityGroupCardItemComponent } from '../sg-list-item/card-item/security-group-card-item.component';
import { SecurityGroupRowItemComponent } from '../sg-list-item/row-item/security-group-row-item.component';
import { TranslateService } from '@ngx-translate/core';
import { SecurityGroupViewMode } from '../sg-filter/containers/sg-filter.container';
import { ListService } from '../../shared/components/list/list.service';


@Component({
  selector: 'cs-security-group-list',
  templateUrl: 'security-group-list.component.html'
})
export class SecurityGroupListComponent implements OnChanges {
  @Input() public securityGroups: Array<SecurityGroup>;
  @Input() public query: string;
  @Input() public mode: ViewMode;
  @Input() public viewMode: SecurityGroupViewMode;
  public groupings = [];

  public inputs;
  public outputs;

  constructor(
    private translateService: TranslateService,
    public listService: ListService
  ) {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: SecurityGroup) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectSecurityGroup.bind(this),
    };
  }

  public ngOnChanges(changes) {
    this.groupings = this.viewMode === SecurityGroupViewMode.Templates ? [
      {
        key: 'types',
        label: 'SECURITY_GROUP_PAGE.FILTERS.GROUP_BY_TYPES',
        selector: (item: SecurityGroup) => item.type,
        name: (item: SecurityGroup) => {
          switch (item.type) {
            case SecurityGroupType.PredefinedTemplate: {
              return this.translateService.instant(
                'SECURITY_GROUP_PAGE.LIST.SYSTEM_SECURITY_GROUPS');
            }
            case SecurityGroupType.CustomTemplate: {
              return this.translateService.instant(
                'SECURITY_GROUP_PAGE.LIST.CUSTOM_SECURITY_GROUPS');
            }
          }
        }
      }
    ] : [];
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
