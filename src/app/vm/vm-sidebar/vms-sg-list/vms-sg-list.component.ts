import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecurityGroup } from '../../../security-group/sg.model';

@Component({
  selector: 'cs-vms-sg-list',
  templateUrl: 'vms-sg-list.component.html',
  styleUrls: ['vms-sg-list.component.scss'],
})
export class VmsSgListComponent {
  @Input()
  public securityGroups: SecurityGroup[];
  @Input()
  public isLoading: boolean;
  @Output()
  public save = new EventEmitter<any>(); // todo
  @Output()
  public cancel = new EventEmitter();

  public currentSelectedSecurityGroup: SecurityGroup;

  public selectSecurityGroup(sg: SecurityGroup): void {
    if (!sg.isPreselected) {
      this.currentSelectedSecurityGroup = sg;
    }
  }
}
