import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SecurityGroup } from '../sg.model';

@Component({
  selector: 'cs-security-group-template-list-item',
  templateUrl: 'sg-template-list-item.component.html',
  styleUrls: ['sg-template-list-item.component.scss']
})
export class SgTemplateListItemComponent {
  @Input() public securityGroupTemplate: SecurityGroup;
  @Input() public query: string;
}
