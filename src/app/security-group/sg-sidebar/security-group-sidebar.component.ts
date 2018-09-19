import {
  Component,
  Input
} from '@angular/core';
import { getType, isDefault, SecurityGroup, SecurityGroupType } from '../sg.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cs-sg-sidebar',
  templateUrl: 'security-group-sidebar.component.html',
  styleUrls: ['security-group-sidebar.component.scss']
})
export class SecurityGroupSidebarComponent {
  @Input() public entity: SecurityGroup;
  @Input() public defaultGroupName: string;

  public get isPredefinedTemplate(): boolean {
    return this.entity && getType(this.entity) === SecurityGroupType.PredefinedTemplate;
  }

  public get securityGroupName(): string {
    if (isDefault(this.entity)) {
      return this.defaultGroupName || this.entity.name;
    } else {
      return this.entity.name
    }
  }

  constructor(
    protected route: ActivatedRoute
  ) {
  }

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild.routeConfig.path;
    return (tabId === pathLastChild);
  }
}
