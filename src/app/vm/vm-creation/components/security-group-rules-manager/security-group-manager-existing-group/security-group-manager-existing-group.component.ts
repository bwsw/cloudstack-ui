import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../../../../../security-group/sg.model';

@Component({
  selector: 'cs-security-group-manager-existing-group',
  templateUrl: 'security-group-manager-existing-group.component.html',
  styleUrls: ['security-group-manager-existing-group.component.scss'],
})
export class SecurityGroupManagerExistingGroupComponent {
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
