import { Injectable } from '@angular/core';
import {
  SecurityGroupAction,
  SecurityGroupActionType
} from './sg-action';
import { SecurityGroup } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { SgRulesContainerComponent } from '../containers/sg-rules.container';
import { SecurityGroupService } from '../services/security-group.service';

@Injectable()
export class SecurityGroupRulesAction extends SecurityGroupAction {
  public id = SecurityGroupActionType.View;
  public name = 'SECURITY_GROUP_PAGE.ACTION.RULES';
  public icon = 'visibility';


  constructor(
    dialog: MatDialog,
    dialogService: DialogService,
    jobsNotificationService: JobsNotificationService,
    notificationService: NotificationService,
    securityGroupService: SecurityGroupService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(
      dialog,
      dialogService,
      jobsNotificationService,
      notificationService,
      securityGroupService
    );
  }

  public activate(securityGroup: SecurityGroup): Observable<any> {
    const editMode = this.activatedRoute.snapshot.queryParams.hasOwnProperty('vm');

    return this.dialog.open(SgRulesContainerComponent, <MatDialogConfig>{
      width: '910px',
      data: { securityGroupId: securityGroup.id, editMode }
    })
      .afterClosed();
  }
}
