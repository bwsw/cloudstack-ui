import { Component, Input } from '@angular/core';
import { getType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cs-sg-sidebar',
  templateUrl: 'security-group-sidebar.component.html',
  styleUrls: ['security-group-sidebar.component.scss'],
})
export class SecurityGroupSidebarComponent {
  @Input()
  public entity: SecurityGroup;

  public get isPredefinedTemplate(): boolean {
    return this.entity && getType(this.entity) === SecurityGroupType.PredefinedTemplate;
  }

  constructor(protected route: ActivatedRoute) {}

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild.routeConfig.path;
    return tabId === pathLastChild;
  }
}
