import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../../../../../security-group/sg.model';


@Component({
  selector: 'cs-security-group-manager-existing-group',
  templateUrl: 'security-group-manager-existing-group.component.html'
})
export class SecurityGroupManagerExistingGroupComponent {
  @Input() public securityGroup: SecurityGroup;
}
