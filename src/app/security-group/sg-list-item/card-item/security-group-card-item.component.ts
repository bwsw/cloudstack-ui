import {
  Component,
  Input
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';

@Component({
  selector: 'cs-security-group-card-item',
  templateUrl: 'security-group-card-item.component.html',
  styleUrls: ['security-group-card-item.component.scss']
})
export class SecurityGroupCardItemComponent {
  @Input() public item: SecurityGroup;
  @Input() public searchQuery: () => string;
}
