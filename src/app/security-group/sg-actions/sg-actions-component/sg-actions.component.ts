import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecurityGroup } from '../../sg.model';
import { SecurityGroupAction, SecurityGroupActionType } from '../sg-action';
import { SecurityGroupActionsService } from '../sg-action.service';


@Component({
  selector: 'cs-security-group-actions',
  templateUrl: 'sg-actions.component.html'
})
export class SecurityGroupActionsComponent {
  @Input() public securityGroup: SecurityGroup;
  @Output() public onSecurityGroupDelete = new EventEmitter();

  constructor(public securityGroupActionsService: SecurityGroupActionsService) {
  }

  public onAction(action: SecurityGroupAction): void {
    action.activate(this.securityGroup).subscribe(() => {
      switch (action.id) {
        case SecurityGroupActionType.Delete: {
          this.onSecurityGroupDelete.emit(this.securityGroup);
        }
      }
    });
  }
}
