import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { isDefault, SecurityGroup } from '../../sg.model';
import { SecurityGroupListItemComponent } from '../security-group-list-item.component';
import { VirtualMachine } from '../../../vm';
import { NgrxEntities } from '../../../shared/interfaces';


@Component({
  selector: 'cs-security-group-card-item',
  templateUrl: 'security-group-card-item.component.html',
  styleUrls: ['security-group-card-item.component.scss']
})
export class SecurityGroupCardItemComponent extends SecurityGroupListItemComponent {
  @Input() public item: SecurityGroup;
  @Input() public searchQuery: () => string;
  @Input() public isSelected: (securityGroup) => boolean;
  @Input() public vmList: NgrxEntities<VirtualMachine>;
  @Input() public defaultGroupName: string;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  public get securityGroupName(): string {
    if (isDefault(this.item)) {
      return this.defaultGroupName || this.item.name;
    } else {
      return this.item.name
    }
  }
}
