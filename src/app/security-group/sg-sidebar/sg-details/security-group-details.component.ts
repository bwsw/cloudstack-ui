import { Component, Input } from '@angular/core';
import { getType, SecurityGroup, SecurityGroupType } from '../../sg.model';

@Component({
  selector: 'cs-security-group-details',
  templateUrl: 'security-group-details.component.html',
})
export class SecurityGroupDetailsComponent {
  @Input()
  public securityGroup: SecurityGroup;

  public get isPrivate() {
    return getType(this.securityGroup) === SecurityGroupType.Private;
  }

  public get securityGroupType(): SecurityGroupType {
    return getType(this.securityGroup);
  }
}
