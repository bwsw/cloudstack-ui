import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SecurityGroup } from '../../sg.model';
import { SecurityGroupActionService, SecurityGroupActionType } from '../sg-action.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Action } from '../../../shared/models';

@Component({
  selector: 'cs-security-group-actions',
  templateUrl: 'sg-actions.component.html',
})
export class SecurityGroupActionsComponent implements OnInit {
  @Input()
  public securityGroup: SecurityGroup;
  @Output()
  public securityGroupDeleted = new EventEmitter<SecurityGroup>();
  @Output()
  public securityGroupViewSelected = new EventEmitter<SecurityGroup>();
  @Output()
  public securityGroupConverted = new EventEmitter<SecurityGroup>();
  public actions: Action<SecurityGroup>[];

  constructor(
    private securityGroupActionService: SecurityGroupActionService,
    private dialogService: DialogService,
  ) {}

  public ngOnInit() {
    this.actions = this.securityGroupActionService.actions;
  }

  public onAction(action): void {
    switch (action.command) {
      case SecurityGroupActionType.Delete: {
        this.dialogService
          .confirm({ message: 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_DELETION' })
          .subscribe(res => {
            if (res) {
              this.securityGroupDeleted.emit(this.securityGroup);
            }
          });
        break;
      }
      case SecurityGroupActionType.View: {
        this.securityGroupViewSelected.emit(this.securityGroup);
        break;
      }
      case SecurityGroupActionType.Convert: {
        this.securityGroupConverted.emit(this.securityGroup);
        break;
      }
      default:
        break;
    }
  }
}
