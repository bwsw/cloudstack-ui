import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../sg.model';

@Component({
  selector: 'cs-sg-sidebar',
  templateUrl: 'security-group-sidebar.component.html'
})
export class SecurityGroupSidebarComponent {
  @Input() public entity: SecurityGroup;

}
