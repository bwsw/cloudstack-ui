import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgrxEntities } from '../../../shared/interfaces';
import { VirtualMachine } from '../../../vm';

import { SecurityGroup } from '../../sg.model';
import { SecurityGroupListItemComponent } from '../security-group-list-item.component';

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
}
