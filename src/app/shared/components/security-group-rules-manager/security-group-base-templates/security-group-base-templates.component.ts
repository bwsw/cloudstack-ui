import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../../../../security-group/sg.model';


@Component({
  selector: 'cs-security-group-base-templates',
  templateUrl: 'security-group-base-templates.component.html'
})
export class SecurityGroupBaseTemplatesComponent {
  @Input() public securityGroups: Array<SecurityGroup>;

  public get securityGroupsLine(): string {
    return this.securityGroups.map(securityGroup => {
      return securityGroup.name;
    })
      .join(', ');
  }
}
