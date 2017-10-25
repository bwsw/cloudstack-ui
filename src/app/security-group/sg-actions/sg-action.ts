import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SecurityGroupService } from '../services/security-group.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { SecurityGroup } from '../sg.model';
import { Action } from '../../shared/interfaces/action.interface';
import { NotificationService } from '../../shared/services/notification.service';


@Injectable()
export abstract class SecurityGroupAction implements Action<SecurityGroup> {
  public name: string;
  public icon?: string;

  constructor(
    protected dialog: MatDialog,
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected notificationService: NotificationService,
    protected securityGroupService: SecurityGroupService
  ) {}

  public abstract activate(securityGroup: SecurityGroup, params?: {}): Observable<any>;

  public canActivate(securityGroup: SecurityGroup): boolean {
    return true;
  }

  public hidden(securityGroup: SecurityGroup): boolean {
    return false;
  }
}
