import { Injectable } from '@angular/core';
import { SecurityGroupAction, SecurityGroupActionType } from './sg-action';
import { SecurityGroup } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../services/security-group.service';
import { Router } from '@angular/router';

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
    private router: Router
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
    this.router.navigate(
      [`security-group/${securityGroup.id}/rules`],
      { queryParamsHandling: 'preserve' }
    );

    return Observable.of(securityGroup);
  }
}
