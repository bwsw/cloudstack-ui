import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { SecurityGroup } from '../../sg.model';
import { SecurityGroupListItemComponent } from '../security-group-list-item.component';
import { MatMenuTrigger } from '@angular/material';
import { VirtualMachine } from '../../../vm';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'cs-security-group-card-item',
  templateUrl: 'security-group-card-item.component.html',
  styleUrls: ['security-group-card-item.component.scss']
})
export class SecurityGroupCardItemComponent extends SecurityGroupListItemComponent {
  @Input() public item: SecurityGroup;
  @Input() public searchQuery: () => string;
  @Input() public isSelected: (securityGroup) => boolean;
  @Input() public vmList: Dictionary<VirtualMachine>;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;
}
