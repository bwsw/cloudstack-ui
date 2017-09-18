import { Component, Input } from '@angular/core';
import { SecurityGroup } from '../../sg.model';
import { SecurityGroupAction } from '../sg-action';
import { SecurityGroupActionsService } from '../sg-action.service';


@Component({
  selector: 'cs-security-group-actions',
  templateUrl: 'sg-actions.component.html'
})
export class SecurityGroupActionsComponent {
  @Input() public securityGroup: SecurityGroup;

  constructor(public securityGroupActionsService: SecurityGroupActionsService) {}

  public onAction(action: SecurityGroupAction): void {
    action.activate(this.securityGroup).subscribe();
  }
}
