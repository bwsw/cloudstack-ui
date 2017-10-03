import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../sg.model';

@Component({
  selector: 'cs-security-group-list-item',
  templateUrl: 'security-group-list-item.component.html',
  styleUrls: ['security-group-list-item.component.scss']
})
export class SecurityGroupListItemComponent {
  @Input() public securityGroupTemplate: SecurityGroup;
  @Input() public query: string;
}
