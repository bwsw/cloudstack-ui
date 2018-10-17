import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { SecurityGroup } from '../../sg.model';
import { SecurityGroupListItemComponent } from '../security-group-list-item.component';
import { VirtualMachine } from '../../../vm';
import { NgrxEntities } from '../../../shared/interfaces';

@Component({
  selector: 'cs-security-group-row-item',
  templateUrl: 'security-group-row-item.component.html',
  styleUrls: ['security-group-row-item.component.scss'],
})
export class SecurityGroupRowItemComponent extends SecurityGroupListItemComponent {
  @Input()
  public item: SecurityGroup;
  @Input()
  public searchQuery: () => string;
  @Input()
  public isSelected: (securityGroup) => boolean;
  @Input()
  public vmList: NgrxEntities<VirtualMachine>;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;
}
