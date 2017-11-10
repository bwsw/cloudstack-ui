import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';


@Component({
  selector: 'cs-security-group-details',
  templateUrl: 'security-group-details.component.html'
})
export class SecurityGroupDetailsComponent {
  @Input() public securityGroup: SecurityGroup;


}
