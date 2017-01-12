import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SecurityGroup } from './security-group.model';

@Component({
  selector: 'cs-security-group-template-list-item',
  templateUrl: './security-group-template-list-item.component.html',
  styleUrls: ['./security-group-template-list-item.component.scss']
})
export class SecurityGroupTemplateListItemComponent {
  @Input() public securityGroupTemplate: SecurityGroup;
  @Output() public onClick = new EventEmitter();
}
