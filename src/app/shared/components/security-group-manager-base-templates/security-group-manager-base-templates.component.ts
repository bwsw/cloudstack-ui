import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../../../security-group/sg.model';

@Component({
  selector: 'cs-security-group-manager-base-templates',
  templateUrl: 'security-group-manager-base-templates.component.html',
  styleUrls: ['security-group-manager-base-templates.component.scss'],
})
export class SecurityGroupManagerBaseTemplatesComponent {
  @Input()
  public securityGroups: SecurityGroup[];

  public get securityGroupsLine(): string {
    return this.securityGroups
      .map(securityGroup => {
        return securityGroup.name;
      })
      .join(', ');
  }
}
