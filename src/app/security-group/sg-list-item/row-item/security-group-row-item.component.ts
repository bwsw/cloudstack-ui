import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';

@Component({
  selector: 'cs-security-group-row-item',
  templateUrl: 'security-group-row-item.component.html',
  styleUrls: ['security-group-row-item.component.scss']
})
export class SecurityGroupRowItemComponent {
  @Input() public item: SecurityGroup;
  @Input() public query: string;
}
