import {
  Component,
  Input
} from '@angular/core';
import { getType, isDefault, SecurityGroup, SecurityGroupType } from '../../sg.model';


@Component({
  selector: 'cs-security-group-details',
  templateUrl: 'security-group-details.component.html'
})
export class SecurityGroupDetailsComponent {
  @Input() public securityGroup: SecurityGroup;
  @Input() public defaultGroupName: string;

  public get isPrivate() {
    return getType(this.securityGroup) === SecurityGroupType.Private;
  }

  public get securityGroupType(): SecurityGroupType {
    return getType(this.securityGroup);
  }

  public get securityGroupName(): string {
    if (isDefault(this.securityGroup)) {
      return this.defaultGroupName || this.securityGroup.name;
    } else {
      return this.securityGroup.name;
    }
  }
}
