import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecurityGroup } from '../../sg.model';
import {
  SecurityGroupActionService,
  SecurityGroupActionType
} from '../sg-action.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-security-group-actions',
  templateUrl: 'sg-actions.component.html'
})
export class SecurityGroupActionsComponent {
  @Input() public securityGroup: SecurityGroup;
  @Output() public onSecurityGroupDelete = new EventEmitter<SecurityGroup>();
  @Output() public onSecurityGroupView = new EventEmitter<SecurityGroup>();
  @Output() public onSecurityGroupConvert = new EventEmitter<SecurityGroup>();

  constructor(
    public securityGroupActionService: SecurityGroupActionService,
    private dialogService: DialogService
  ) {
  }

  public onAction(action): void {
    switch (action.command) {
      case SecurityGroupActionType.Delete: {
        this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_DELETION' })
          .subscribe((res) => {
            if (res) {
              this.onSecurityGroupDelete.emit(this.securityGroup);
            }
          });
        break;
      }
      case SecurityGroupActionType.View: {
        this.onSecurityGroupView.emit(this.securityGroup);
        break;
      }
      case SecurityGroupActionType.Convert: {
        this.onSecurityGroupConvert.emit(this.securityGroup);
      }
    }
  }
}
