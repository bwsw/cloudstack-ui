import { Injectable } from '@angular/core';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroup } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../services/security-group.service';
import { Router } from '@angular/router';

@Injectable()
export class SecurityGroupViewAction extends SecurityGroupAction {
  public name = 'COMMON.VIEW';
  public icon = 'visibility';


  constructor(
    dialog: MdDialog,
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

  public activate(securityGroup: SecurityGroup, params?: {}): Observable<any> {
    this.router.navigate(
      [`security-group/${securityGroup.id}`],
      { queryParamsHandling: 'preserve' }
    );

    return Observable.of(securityGroup);
  }
}
